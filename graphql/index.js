const { Octokit } = require('octokit');
const fetch = require('node-fetch');
class GraphqlApi {
  constructor (token) {
    this.octokit = new Octokit({ auth: token, request: { fetch } });
  }

  query (q) {
    console.log("HOLAAAA")
    return this.octokit.graphql(q);
  }
}

module.exports = GraphqlApi;
