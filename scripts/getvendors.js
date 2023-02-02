const http = require("http"); // or 'https' for https:// URLs
const fs = require("fs");
const path = require("path");

const URLs = {
	gear: "http://rubenalamina.mx/division/gear.json",
	weapons: "http://rubenalamina.mx/division/weapons.json",
};

for (const key in URLs) {
	if (Object.hasOwnProperty.call(URLs, key)) {
		const url = URLs[key];
		const request = http.get(url, function(res) {
			let body = "";

			res.on("data", (chunk) => {
				body += chunk;
			});

			res.on("end", () => {
				try {
					fs.writeFile(
						path.resolve(
							__dirname,
							"../public/vendors",
							`${key}.json`
						),
						body,
						(err) => {
							// throws an error, you could also catch it here
							if (err) throw err;

							// success case, the file was saved
							console.log(`${key}.json SAVED`);
						}
					);
				} catch (error) {
					console.error(error.message);
				}
			});
		});
	}
}
