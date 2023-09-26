/**
 * getInfoFromIssue: 
 * is a function to generate the query string to get the info related with the issue
 * 
 *
 * @param {string} userName - user to login
 * @param {string} repoName
 * @param {string} issueNumber - number of the issue that want to move
 * @param {string} projectNumber - number of the prpject that want to affect
 * @return {string} a string of queries that returns us issue info project info, cols info, and  project item info related to the issue
 *
 * @example
 * getInfoFromIssue(githubUser, myRepo, 3, 1)
 *     
 */
function getInfoFromIssue (userName, repoName, issueNumber, projectNumber) {
  return `
  {
    user(login: "${userName}") {
      repository(name: "${repoName}") {
        issue1: issue(number: ${issueNumber}) {
          title
          createdAt
          id
          projectV2(number: ${projectNumber}) {
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
  }
  `
}

module.exports = {
  getInfoFromIssue
}