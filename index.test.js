const process = require('process');
const cp = require('child_process');
const core = require('@actions/core');
const path = require('path');

const { GraphQLHandler } = require('graphql-mocks');
const { nockHandler } = require('@graphql-mocks/network-nock');
const nock = require('nock')

const hanlder = new GraphQLHandler();

hanlder.query(`
    user(login: "") {
      repository(name: "repo") {
        issue1: issue(number: undefined) {
          title
          createdAt
          id
          projectV2(number: ) {
            id
            title
            field(name: "Status") {
              __typename
              ... on ProjectV2SingleSelectField {
                id
                options {
                  id
                  name
                }
              }
            }
          }
          projectItems(first:1){
            __typename
            nodes {
              type
              id
              content {
                __typename
                ...on Issue{
                  number
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  }`);

nock("https://api.github.com").post('/graphql').times(1000).reply(200, 'Ok')

describe("Test", () => {
 
  test('if project item was found change its status', () => {
    const issueInfo = { user: { repository: { issue1: { title: '[Task]:  Testing Actions', createdAt: '2023-08-06T15:50:41Z', id: 'I_kwDOJ4bThM5tkZGt', projectV2: { id: 'PVT_kwHOANGp0s4ATT8y', title: 'Scrapper Infracciones', field: { __typename: 'ProjectV2SingleSelectField', id: 'PVTSSF_lAHOANGp0s4ATT8yzgMVbsY', options: [{ id: 'c1a353c4', name: 'Backlog' }, { id: 'f75ad846', name: 'Todo' }, { id: '47fc9ee4', name: 'In Progress' }, { id: '6d23dd3c', name: 'In code Review' }, { id: '98236657', name: 'Done' }] } }, projectItems: { __typename: 'ProjectV2ItemConnection', nodes: [{ type: 'ISSUE', id: 'PVTI_lAHOANGp0s4ATT8yzgIYlf4', content: { __typename: 'Issue', number: 33, id: 'I_kwDOJ4bThM5tkZGt', title: '[Task]:  Testing Actions' } }] } } } } };
    const spyGetInput = jest.spyOn(core, 'getInput');
    spyGetInput.mockReturnValue('HOLAAaa');
    const ip = path.join(__dirname, 'index.js');
    process.env['GITHUB_REPOSITORY'] = 'owner/repo';
    const result = cp.execSync(`node ${ip}`, { env: process.env, stdio: 'inherit' }).toString();
    
    console.log(result);
  })
});
