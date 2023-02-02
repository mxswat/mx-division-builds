<template>
	<div class="table-modal" style="height: 100%">
		<span class="info"
			>Click on the column header to sort it, or click to hamburger icon
			to search (The search will be improved next updates)</span
		>
		<ag-grid-vue
			style="height: 100%"
			class="ag-theme-alpine-dark"
			:columnDefs="columnDefs"
			:rowData="rowData"
			:gridOptions="gridOptions"
			@first-data-rendered="onFirstDataRendered"
		></ag-grid-vue>
	</div>
</template>

<script>
	import { AgGridVue } from "ag-grid-vue";
	export default {
		name: "TableModal",
		props: ["gearData", "onModalClose", "tableHeaders"],
		components: { AgGridVue },
		data() {
			return {
				rowData: null,
				gridOptions: {
					onRowClicked: this.onRowClicked,
					suppressCellSelection: true,
				},
				columnDefs: this.tableHeaders,
				gridColumnApi: null,
			};
		},
		methods: {
			onRowClicked(node) {
				this.$emit("close");
				this.onModalClose(node.data);
			},
			onFirstDataRendered(params) {
				var allColumnIds = [];
				this.gridColumnApi.getAllColumns().forEach(function(column) {
					allColumnIds.push(column.colId);
				});
				this.gridColumnApi.autoSizeColumns(allColumnIds, false);
			},
		},
		mounted() {
			this.rowData = this.gearData;
			this.gridColumnApi = this.gridOptions.columnApi;
		},
	};
</script>

<style>
	span.ag-header-icon.ag-header-cell-menu-button {
		opacity: 1 !important;
	}

	.table-modal {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.info {
		padding: 8px;
	}
</style>
