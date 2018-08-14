module.exports = {
	debug: true,
	cpu: false,
	maxConstructionSites: 2,
	pathUseMinimumTimesUsed: 10,
	pathUseRemoveAge: 100,
	creepTypeCount: {
		A: 10,
		B: 0,
	},
	job: {
		spawnSupply:		{ count: 1, priority: 1},
		containerHarvest:	{ count: 1, priority: 2},
		towerSupply:		{ count: 1, priority: 2},
		linkSupply:			{ count: 1, priority: 3},
		repair:				{ count: 1, priority: 3},
		build:				{ count: 2, priority: 4},
		storageHarvest:		{ count: 1, priority: 5},
		mineralHarvest:		{ count: 1, priority: 5, unassignOnReload: true},
		upgrade:			{ count: 3, priority: 5},
	},
};