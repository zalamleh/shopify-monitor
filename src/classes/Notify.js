const DiscordWebhook = require("discord-webhooks");

let Notify = {};

// Quicktasks by aabbccsmith#6537, feel free to add your own!
let qtlinks = [
	{
		url: "http://anb.adidas.com:54685/discorLink?url=",
		bot: "[ANB]"
	},
	{
		url: "http://api.destroyerbots.io/quicktask?url=",
		bot: "[PD]" 
	},
	{
		url: "https://thekickstationapi.com/quick-task.php?autostart=true&link=",
		bot: "[TKS]" 
	},
	{
		url: "https://activation.easycopbots.com/task/qt/?site=SITE&link=",
		bot: "[EASYCOP]" 
	},
	{
		url: "https://api.dashe.io/v1/actions/quicktask?url=",
		bot: "[DASHE]" 
	},
	{
		url: "https://atomaio.com/dashboard/quicktask?url=",
		bot: "[ATOM]" 
	},
	{
		url: "https://cybersole.io/dashboard/quicktask?url=",
		bot: "[CYBER]" 
	}
];

Notify.discord = function (webhook_url, url, brand, metadata, type, color) {

	let myWebhook = new DiscordWebhook(webhook_url);
	let stock = 'Stock not available';

	if ((typeof metadata.stock).toLowerCase() === "number") {
		stock = 'Unavailable';
	} else {
		stock = metadata.stock;
	}

	let price = metadata.price

	let links;
	let qtFormatted = "- ";
	
	if (Array.isArray(metadata.links)) {
		qtlinks.forEach(qtlink => {
			qtFormatted += `${qtlink.bot}(${qtlink.url}${url}) - `;
		});
		
		const set = [];
		for (let i = 0; i < metadata.links.length; i++) {
			const letiant = metadata.links[i];
			let baseUrl = letiant.baseUrl;
			set.push(`[${letiant.title}](${baseUrl}/cart/${letiant.id}:1)`);
		}
		links = set.join('\n');
	} else {
		links = 'Unavailable';
	}

	myWebhook.on("ready", () => {
		myWebhook.execute({
			embeds: [{
				"title": metadata.title,
				"url": url,
				"color": color,
				"timestamp": new Date().toISOString(),
				"footer": {
					"icon_url":"https://cdn.discordapp.com/embed/avatars/0.png",
					"text": "Shopify Monitor by Zak"
				},
				"thumbnail": {
					"url": metadata.img
				},
				"author": {
					"name": "Shopify Monitor",
					"url": "https://discordapp.com",
					"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
				},
				"fields": [{
					"name": "Notification Type",
					"value": type,
					"inline": true
				}, {
					"name": "Stock Count",
					"value": stock,
					"inline": true
				}, {
					"name": "Site",
					"value": brand,
					"inline": true
				}, {
					"name": "Price",
					"value": price,
					"inline": true
				}, {
					"name": "Link",
					"value": url,
					"inline": true
				}, {
					"name": "ATC",
					"value": links,
					"inline": true
				}, {
					"name": "Quick Tasks",
					"value": qtFormatted
					
				}]
			}]
		});
	});
}

Notify.discordTest = function (webhook_url) {
	let myWebhook = new DiscordWebhook(webhook_url);
	myWebhook.on("ready", () => {
		myWebhook.execute({
			content: "Shopify Monitor Test"
		});
	});
}

Notify.ys = function (webhook_url, data) {
	let myWebhook = new DiscordWebhook(webhook_url);
	myWebhook.on("ready", () => {
		let exec = {
			embeds: [{
				"title": "Yeezy Supply Monitor",
				"description": data.title,
				"url": "https://yeezysupply.com/",
				"color": 15844367,
				"timestamp": new Date().toISOString(),
				"footer": {
					"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
					"text": "Shopify Monitor by aabbccsmith"
				},
				"thumbnail": {
					"url": data.img
				},
				"author": {
					"name": "Shopify Monitor",
					"url": "https://discordapp.com",
					"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
				},
				"fields": [{
					"name": "Sizes",
					"value": (data.letiants == null) ? 'Unavailable' : data.letiants.map(x => x = x.options[0] + ` - ${x.id}`).join('\n'),
					"inline": true
				}]
			}]
		}
		myWebhook.execute(exec);
	});
}

module.exports = Notify;
