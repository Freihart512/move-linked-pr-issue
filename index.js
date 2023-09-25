const core = require('@actions/core');
const github = require('@actions/github');

const graphqlApi = require('./graphql');
var get = require('lodash.get');
const { getProjectInfoByNameWithUser, getProjectInfoByNameWithOrg } = require('./graphql/queries');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    core.info(payload);

    return;



    const projectName = core.getInput('project_name');
    const userName = core.getInput('user_name');
    const orgName = core.getInput('org_name');
    const targetColName = core.getInput('targetCol');
    const githubToken = core.getInput('github_token');
    const personalToken = core.getInput('personal_token');

    const token = personalToken || githubToken;

    const graphqlInstance = new graphqlApi(token);
    
    
    core.info(`getting project info ...`);
    const getProjectQuery = orgName ? getProjectInfoByNameWithOrg(projectName, userName) : getProjectInfoByNameWithUser(projectName, userName) 
    core.info(getProjectQuery);
    const reponse = await graphqlInstance.query(`
    mutation {
      updateProjectV2ItemFieldValue(
        input: {projectId: "PVT_kwHOANGp0s4ATT8y", itemId: "I_kwDOJ4bThM5tkZGt", fieldId: "PVTSSF_lAHOANGp0s4ATT8yzgMVbsY", value: {singleSelectOptionId: "47fc9ee4"}}
      ) {
        projectV2Item {
          id
        }
      }
    }`)
    //{"user":{"projectsV2":{"edges":[{"node":{"id":"PVT_kwHOANGp0s4ATT8y","title":"Scrapper Infracciones","field":{"__typename":"ProjectV2SingleSelectField","id":"PVTSSF_lAHOANGp0s4ATT8yzgMVbsY","options":[{"id":"c1a353c4","name":"Backlog"},{"id":"f75ad846","name":"Todo"},{"id":"47fc9ee4","name":"In Progress"},{"id":"6d23dd3c","name":"In code Review"},{"id":"98236657","name":"Done"}]}}}]}}}
    // const p =  get(reponse, 'user.projectsV2,edges[0].node');
    // const project = {
    //   id: p.id,
    //   title: p.title,
    //   colsId: p.field,
    //   colsOptions: p.field.options
    // }

    // const targetCol = project.colsOptions.filter(col => col.name === targetColName);



    core.info(`Project ${JSON.stringify(reponse)}`);
    core.debug(reponse);
    core.debug(JSON.stringify(reponse));
  } catch (error) {
    core.info(`error ${error} ...`);
    core.setFailed(error.message);
  }
}

run();
