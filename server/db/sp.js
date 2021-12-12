const Account = require("./models/account");
const MenuItem = require("./models/menuItem");
const Style = require("./models/style");

async function bbb(){
	try {
		const acc = new Account({
			username: "user1",
			password: "pass",
			name: "Pesto",
			img: "https://www.bechtle.com/shop/medias/5c3d8c8a4c2f8578cbf0a769-900Wx900H-820Wx820H?context=bWFzdGVyfHJvb3R8NzI3OTZ8aW1hZ2UvanBlZ3xoOTMvaDdmLzEwMTU1Mjk1NDQwOTI2LmpwZ3w5NTFkZTZjYzYyMTUxNzk1ZGVhZDkxOWE0YTgwZjExYWQ5Y2I4MGZiNDQxMzE2ODM3YTA5MTViMGU2MWIxYmFh",
			email: "aramazd1997@gmail.com",
			typeId: "cafe",
			subTypeId: "manager",
			status: "enabled",
			menuTypes: [
				{
					name: "Drink",
					url: "https://graphql.org/brand/"
				},{
					name: "Meal",
					url: "https://graphql.org/"
				},
			],
			stylesId: 1,
			menuItems: [1,2,3],
			mainDishes: [2,6,7],
		})
		await acc.save();
		return;
	} catch (e) {
		console.log("error script")
		console.log(e)
	}
}

async function mi(){
	try {
		const mi = new MenuItem({
			accountId: 1,
			type: "drink",
			name: "coctail2",
			description: "coctail2 description",
			img: "https://www.bechtle.com/shop/medias/5c3d8c8a4c2f8578cbf0a769-900Wx900H-820Wx820H?context=bWFzdGVyfHJvb3R8NzI3OTZ8aW1hZ2UvanBlZ3xoOTMvaDdmLzEwMTU1Mjk1NDQwOTI2LmpwZ3w5NTFkZTZjYzYyMTUxNzk1ZGVhZDkxOWE0YTgwZjExYWQ5Y2I4MGZiNDQxMzE2ODM3YTA5MTViMGU2MWIxYmFh",
			price: 1299,
			currency: "AMD",
		})
		await mi.save();
		return;
	} catch (e) {
		console.log("error script")
		console.log(e)
	}
}

async function sty(){
	try {
		const sty = new Style({
			navbarBgColor: "#123464",
			navbarTitleColor: "#adadad",
			logo: "http://url.do.co/main/ko.jpg",
			mostBookedBorder: "#dada22",
			fontFamily: "Arial, sans-serif",
		})
		await sty.save();
		return;
	} catch (e) {
		console.log("error script")
		console.log(e)
	}
}

function zasa() {
	const account = {
		"username": "user2",
		"password": "password",
		"name": "AArra",
		"img": "sdfsdaf",
		"email": "asfsdg",
		"typeId": "asf",
		"subTypeId": "asf",
		"status": "enabled",
		"styleId": 1,
		"menuTypes": [{
			"name": "Drink",
			"url": "sdfsdg"
		},
			{
				"name": "Bread",
				"url": "sddffsdg"
			}
		],
		"menuItems": [0, 1, 2, 3, 4]
	}

	console.log(JSON.stringify(account))
}

// bbb();
// mi();
// sty();
zasa();