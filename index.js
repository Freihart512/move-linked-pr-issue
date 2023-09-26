const core = require('@actions/core');
const github = require('@actions/github');

const graphqlApi = require('./graphql');
var get = require('lodash.get');
const { getInfoFromIssue } = require('./graphql/queries');
const { moveItemToStatus } = require('./graphql/mutations');

async function run() {
  const projectNumber = core.getInput('project_number');
  const userName = core.getInput('user_name');
  const targetColName = core.getInput('target_col');
  const githubToken = core.getInput('github_token');
  const personalToken = core.getInput('personal_token');
  const {repo:repoName, number:entityNumber} =  github.context.issue;
  const token = personalToken || githubToken;
  const graphqlInstance = new graphqlApi(token);
  let response = null;
  try {
    core.info(`getting Issuye info ...`);
    const query = getInfoFromIssue(userName, repoName, entityNumber, projectNumber);
    core.info(`Query ... ${query}`,);
    response = await graphqlInstance.query(query);
    core.info(`Query ... ${JSON.stringify(response)}`);
  } catch (error) {
    core.error(`Fails getting a project with those values: ${userName}, ${repoName}, ${entityNumber}, ${projectNumber}`);
    core.error(`Error ${error} ...`);
    core.setFailed(error.message);
    return;
  }
  const projectResponsePath = 'user.repository.issue1.projectV2';
  const project = {
    name: get(response, `${projectResponsePath}.title`,''),
    id: get(response, `${projectResponsePath}.id`, ''),
    statusFieldId: get(response, `${projectResponsePath}.field.id`, ''),
    cols: get(response, `${projectResponsePath}.field.options`, [])
  }
  const issue = {
    id: get(response, 'user.repository.issue1.id',''),
    title: get(response, 'user.repository.issue1.title',''),
    projectItemId: get(response, 'user.repository.issue1.projectItems.nodes[0].id.title','')
  }
  const targetCol = project.cols.filter(col => col.name === targetColName);


  core.info(`Project ${JSON.stringify(project)}`);
  core.info(`issue ${JSON.stringify(issue)}`);
  core.info(`issue ${targetCol}`);

  try {
    const mutationString =  moveItemToStatus(project.id, issue.projectItemId, project.statusFieldId, targetCol.id);
    core.info(`Query ... ${mutationString}`,);
    response = await graphqlInstance.query(mutationString);

    core.info(`the Issue: ${issue.title} now is in ${targetColName}`);
    
  } catch (error) {
    core.error(`Failed changing the status with those values: ${project.id}, ${issue.projectItemId}, ${project.statusFieldId}, ${targetCol.id}`);
    core.error(`Error ${error} ...`);
    core.setFailed(error.message);
  }
}

run();
