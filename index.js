const core = require('@actions/core');
const github = require('@actions/github');
const get = require('lodash.get');
const GraphqlApi = require('./graphql');
const { getInfoFromIssue } = require('./graphql/queries');
const { moveItemToStatus } = require('./graphql/mutations');

/**
 * entry point
 */
async function run () {
  const projectNumber = core.getInput('project_number');
  const userName = core.getInput('user_name');
  const targetColName = core.getInput('target_col');
  const githubToken = core.getInput('github_token');
  const personalToken = core.getInput('personal_token');

  const { repo: repoName, number: entityNumber } = github.context.issue;
  const token = personalToken || githubToken;
  const graphqlInstance = new GraphqlApi(token);
  let response = null;
  try {
    core.info('getting Issue info ...');
    const query = getInfoFromIssue(userName, repoName, entityNumber, projectNumber);
    response = await graphqlInstance.query(query);
    core.info(`Issue info got successfuly ... ${JSON.stringify(response)}`);
  } catch (error) {
    core.error(`Fails getting a project with those values: ${userName}, ${repoName}, ${entityNumber}, ${projectNumber}`);
    core.error(`Error ${error} ...`);
    core.setFailed(error.message);
    throw new Error(error);
  }
  const projectResponsePath = 'user.repository.issue1.projectV2';
  const project = {
    name: get(response, `${projectResponsePath}.title`, ''),
    id: get(response, `${projectResponsePath}.id`, ''),
    statusFieldId: get(response, `${projectResponsePath}.field.id`, ''),
    cols: get(response, `${projectResponsePath}.field.options`, [])
  };

  if (!project.id) {
    core.error(`Project number [${projectNumber}] was not found.`);
    return;
  }

  const issue = {
    id: get(response, 'user.repository.issue1.id', ''),
    title: get(response, 'user.repository.issue1.title', ''),
    projectItemId: get(response, 'user.repository.issue1.projectItems.nodes[0].id', '')
  };

  if (!issue.id) {
    core.error(`Issue [${entityNumber}] was not found.`);
    return;
  }

  if (!issue.projectItemId) {
    core.error(`Project item for this issue [${entityNumber}] was not found.`);
    return;
  }

  const targetCol = project.cols.find(col => col.name === targetColName);
  if (!targetCol) {
    core.error(`Target colum [${targetColName}] was not found.`);
    return;
  }

  try {
    const mutationString = moveItemToStatus(project.id, issue.projectItemId, project.statusFieldId, targetCol.id);
    response = await graphqlInstance.query(mutationString);

    core.info(`the Issue[${issue.title}] now is in ${targetColName}`);
  } catch (error) {
    core.error(`Failed changing the status with those values: ${project.id}, ${issue.projectItemId}, ${project.statusFieldId}, ${targetCol.id}`);
    core.error(`Error ${error} ...`);
    core.setFailed(error.message);
  }
}

run();
