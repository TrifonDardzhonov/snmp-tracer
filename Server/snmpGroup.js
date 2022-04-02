function findGroup(node, value) {
    let group;

    if (node.supportGrouping) {
        if (!group) {
            group = searchInBetweenGroups(node.groupingBetween, value);
        }
        if (!group) {
            group = searchInMatchingGroups(node.groupingMatch, value);
        }
    }
    if (!group) {
        group = emptyGroup();
    }

    return group
}

function searchInBetweenGroups(groupingBetween, value) {
    if (groupingBetween.length > 0) {
        for (let i = 0; i < groupingBetween.length; i++) {
            const from = Number(groupingBetween[i].from);
            const to = Number(groupingBetween[i].to);
            if (from <= Number(value) && Number(value) <= to) {
                return {
                    value: groupingBetween[i].result, // return additional group properties
                }
            }
        }
    }
    return null;
}

function searchInMatchingGroups(groupingMatch, value) {
    if (groupingMatch.length > 0) {
        for (let i = 0; i < groupingMatch.length; i++) {
            if (groupingMatch[i].original === value) {
                return {
                    value: groupingMatch[i].result, // return additional group properties
                }
            }
        }
    }
    return null;
}

function emptyGroup() {
    return {
        value: "N/A"
    };
}

module.exports = {
    findGroup: findGroup
};