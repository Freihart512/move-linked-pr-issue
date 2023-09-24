const core = require('@actions/core');
const graphqlApi = require('./graphql');
const  fetch = require("node-fetch");
const { getProjectInfoByNameWithUser, getProjectInfoByNameWithOrg } = require('./graphql/queries');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const projectName = core.getInput('project_name');
    const userName = core.getInput('user_name');
    const orgName = core.getInput('org_name');
    const targetCol = '' // core.getInput('targetCol');
    const githubToken = core.getInput('github_token');
    const personalToken = core.getInput('personal_token');

    core.info(`Este es fetch`, fetch);
    const graphqlInstance = new graphqlApi(personalToken);
    
    
    core.info(`getting project info ...`);
    const getProjectQuery = orgName ? getProjectInfoByNameWithOrg(projectName, userName) : getProjectInfoByNameWithUser(projectName, userName) 
    core.info(getProjectQuery);
    const project = await graphqlInstance.query(getProjectQuery)

    core.info(`Project ${JSON.stringify(project)}`);
    core.debug(project);
    core.debug(JSON.stringify(project));
  } catch (error) {
    core.info(`error ${error} ...`);
    core.setFailed(error.message);
  }
}

run();
