function find(node, value) {
    let group;
    if (node.supportGrouping) {
        if (!group) {
            group = searchInMatchingGroups(node.groupingMatch, value);
        }
        if (!group) {
            group = searchInBetweenGroups(node.groupingBetween, value);
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
                    id: groupingBetween[i].id,
                    value: groupingBetween[i].result,
                    script: groupingBetween[i].script,
                }
            }
        }
    }
    return null;
}

function searchInMatchingGroups(groupingMatch, value) {
    if (groupingMatch.length > 0) {
        for (let i = 0; i < groupingMatch.length; i++) {
            if (groupingMatch[i].original == value) {
                return {
                    id: groupingMatch[i].id,
                    value: groupingMatch[i].result,
                    script: groupingMatch[i].script,
                }
            }
        }
    }
    return null;
}

function emptyGroup() {
    return {
        id: null,
        value: "Unknown"
    };
}

module.exports = {
    find: find
};