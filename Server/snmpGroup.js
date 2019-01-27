var swarmScaling = require('./swarmScaling');

function findGroup(node, value) {
    let group = {
        value: "N/A"
    };

    if (node.supportGrouping) {
        const between = searchInBetweenGroups(node.groupingBetween, value);
        const match = searchInMatchingGroups(node.groupingMatch, value);

        if (between) {
            group = between;
        } else if (match) {
            group = match;
        }
    }
    return group;
}

function searchInBetweenGroups(groupingBetween, value) {
    if (groupingBetween.length > 0) {
        for (let i = 0; i < groupingBetween.length; i++) {
            const from = Number(groupingBetween[i].from);
            const to = Number(groupingBetween[i].to);
            if (from >= Number(value) && Number(value) <= to) {
                return {
                    value: groupingBetween[i].result,
                    scale: {
                        status: groupingBetween[i].scaling 
                            ? groupingBetween[i].scaling.state
                            : swarmScaling.None
                    }
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
                    value: groupingMatch[i].result,
                    scale: {
                        status: groupingMatch[i].scaling 
                            ? groupingMatch[i].scaling.state
                            : swarmScaling.None
                    }
                }
            }
        }
    }
    return null;
}

module.exports = {
    findGroup: findGroup
};