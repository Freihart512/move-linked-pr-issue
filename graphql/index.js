//const {graphql} = require("@octokit/graphql");
const { Octokit } = require("octokit");
const  fetch = require("node-fetch");
console.log(fetch)

class graphqlApi {
    constructor(token) {
        this.octokit = new Octokit({ auth: token, request: {  fetch } });
    }

    query(q) {
        return  this.octokit.graphql(q);
    }
}

module.exports = graphqlApi;