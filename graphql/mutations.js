/**
 * moveItemToStatus: 
 * is a function to generate the mutation string to change 
 * the status of the project item.
 *
 * @param {string} projectId - id of the project: PVT_xxxxxx
 * @param {string} projectItemId - id of the "card" that want to move: (PVT_element_prefix)_xxxxx
 * @param {string} singleSelectFieldId - id of the field that contains the status in the project: PVTSSF_xxxxxx
 * @param {string} singleSelectOptionId - id of the new status (colum in the board): 47fc9ee4
 * @return {string} string of mutation to change the status of teh item
 *
 * @example
 * moveItemToStatus(PVT_xxxxxx, (PVT_element_prefix)_xxxxx, PVTSSF_xxxxxx, "47fc9ee4")
 *     
 */
function moveItemToStatus (projectId, projectItemId, singleSelectFieldId, singleSelectOptionId) {
    return `
    mutation {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: "${projectId}", 
            itemId: "${projectItemId}", 
            fieldId: "${singleSelectFieldId}", 
            value: {singleSelectOptionId: "${singleSelectOptionId}"}}
        ) {
          projectV2Item {
            id
          }
        }
      }
    `
}

module.exports = {
    moveItemToStatus
}