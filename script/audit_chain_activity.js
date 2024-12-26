// Usage: sudo docker exec jouleverse-mainnet /j/geth --exec 'let BEGIN=2828834,END=4007393; loadScript("/data/audit_chain_activity.js");"done"' attach /data/mainnet/geth.ipc > chain_activity_202408-UTC+8.txt

//for testing
//var begin_block = 3936000
//var end_block = 3964000

// > new Date(eth.getBlock(3828834).timestamp * 1000)
//var begin_block = 3828834 //"2024/8/1 GMT+8 0:00:06" first block of 2024.8
//var end_block = 4007393 //"2024/8/31 GMT+8 23:59:51" last block of 2024.8

const begin_block = BEGIN;
const end_block = END;

const abi_nft = [{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

const abi_jti2 = abi_nft.slice()
abi_jti2.push({"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"sinceBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"})

const abi_planet = abi_nft.slice()
abi_planet.push({"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"planetOfToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"})

const addr_planet = '0x9c100856f5C60a3ec87Aa408567304DB2AfC241F'
const addr_jti2 = '0x7e722837ff19be2687c2089dbf70d064fb9622ae'

eth.defaultAccount = eth.accounts[0]

var contract_planet = eth.contract(abi_planet).at(addr_planet)
var contract_jti2 = eth.contract(abi_jti2).at(addr_jti2)

//contract_planet.tokenOfOwnerByIndex.call(eth.accounts[0], 0)

function getToken(contract, addr) {
	try {
		return contract.tokenOfOwnerByIndex.call(addr, 0)
	} catch (e) {
		return -1
	}
}

/////////////////////////////////////////////////////////

console.log('scanning blocks from ', begin_block, ' to ', end_block, ' ...')

var active_addr_by_planet = {}
for (var i = begin_block; i <= end_block; i++) {
    if (eth.getBlock(i).transactions.length > 0) {
        eth.getBlock(i).transactions.forEach(tx => {
			var from = eth.getTransaction(tx).from
			var planet_token = getToken(contract_planet, from)
			// no planet == on earth
			var planet_num = planet_token == -1 ? 0 : contract_planet.planetOfToken.call(planet_token)
			var jti2_id = getToken(contract_jti2, from)
			
			if (jti2_id > -1) {
				var since_block = contract_jti2.sinceBlock.call(jti2_id)
				if (since_block > end_block) {
					console.log(jti2_id, " was too late")
					jti2_id = -1
				}
			}

			console.log(i, eth.getBlock(i).timestamp, from, jti2_id, planet_num)

			if (active_addr_by_planet[planet_num] == undefined) {
				active_addr_by_planet[planet_num] = {}
			}

			if (active_addr_by_planet[planet_num][from] == undefined) {
				active_addr_by_planet[planet_num][from] = [jti2_id, 1]
			} else {
				active_addr_by_planet[planet_num][from][1] += 1
			}

		})
    }
}

console.log(JSON.stringify(active_addr_by_planet, null, 2))

/////////////////////////////////////////////////////////

/*
unknown: 0, // unknown addrs, e.g. active addr with JTI = -1
active_jti: 0, // total active JTIs
sum_tx: 0, // sum of all n of txs, corresponding to JTI list
jti: [], // list of JTIs
tx: [] // list of JTI's num of transactions
*/

console.log('doing statistics ...')

var stats_by_planet = {}
for (var p in active_addr_by_planet) {
	if (stats_by_planet[p] == undefined) {
		stats_by_planet[p] = {
			unknown: 0,
			active_jti: 0,
			sum_tx: 0,
			jti: [],
			tx: []
		}
	}

	for (var a in active_addr_by_planet[p]) {
		[jti_id, count] = active_addr_by_planet[p][a]
		if (jti_id > -1) {
			stats_by_planet[p].active_jti += 1
			stats_by_planet[p].sum_tx += count
			stats_by_planet[p].jti.push(jti_id)
			stats_by_planet[p].tx.push(count)
		} else {
			stats_by_planet[p].unknown += 1
		}
	}
}

console.log(JSON.stringify(stats_by_planet, null, 2))
