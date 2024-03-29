const columnDef = {
	sortable: true,
	filter: true,
	resizable: true,
};

const gearHeaders = [
	{ headerName: "Quality", field: "Quality", ...columnDef },
	{ headerName: "Brand", field: "Brand", ...columnDef },
	{ headerName: "Item Name", field: "Item Name", ...columnDef },
	{ headerName: "Core", field: "Core", ...columnDef },
	{ headerName: "Attribute 1", field: "Attribute 1", ...columnDef },
	{ headerName: "Attribute 2", field: "Attribute 2", ...columnDef },
	{ headerName: "Mod", field: "Mod", ...columnDef },
	{ headerName: "Talent", field: "Talent", ...columnDef },
];

const weaponsHeaders = [
	{ headerName: "Quality", field: "Quality", ...columnDef },
	{ headerName: "Weapon Type", field: "Weapon Type", ...columnDef },
	{ headerName: "Variant", field: "Variant", ...columnDef },
	{ headerName: "Name", field: "Name", ...columnDef },
	// { headerName: 'Slot', field: 'Slot', ...columnDef }, hidden, not really needed for now
	{ headerName: "Base Damage", field: "Base Damage", ...columnDef },
	{ headerName: "Talent", field: "Talent", ...columnDef },
	{ headerName: "Core 1", field: "Core 1", ...columnDef },
	{ headerName: "Core 2", field: "Core 2", ...columnDef },
	{ headerName: "Attribute 1", field: "Attribute 1", ...columnDef },
	{ headerName: "Mag Size", field: "Mag Size", ...columnDef },
	{ headerName: "RPM", field: "RPM", ...columnDef },
	{
		headerName: "Reload Speed (ms)",
		field: "Reload Speed (ms)",
		...columnDef,
	},
	{ headerName: "Optimal Range", field: "Optimal Range", ...columnDef },
	{ headerName: "Core 1 Max", field: "Core 1 Max", ...columnDef },
	{ headerName: "Core 2 Max", field: "Core 2 Max", ...columnDef },
	{ headerName: "Optics", field: "Optics", ...columnDef },
	{ headerName: "Under Barrel", field: "Under Barrel", ...columnDef },
	{ headerName: "Magazine", field: "Magazine", ...columnDef },
	{ headerName: "Muzzle", field: "Muzzle", ...columnDef },
	{ headerName: "HSD", field: "HSD", ...columnDef },
];

export { gearHeaders, weaponsHeaders };
