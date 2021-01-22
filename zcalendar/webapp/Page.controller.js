sap.ui.define([
	"sap/ui/core/library",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/json/JSONModel",
	"sap/ui/unified/library",
	"sap/m/library",
	"sap/m/MessageToast"
],
function(coreLibrary, Fragment, Controller, DateFormat, JSONModel, unifiedLibrary, mobileLibrary, MessageToast) {
	"use strict";

	return Controller.extend("com.eae.zplanner.Page", {
		getDateFormatter: function() {
			return DateFormat.getDateInstance({
			pattern: "YYYY-MM-dd"
		});
		},

		onInit: function() {
			// set explored app's demo model on this sample
			this.table = this.getView().byId("timeSlotTable");

			var uiModel = new JSONModel();
			uiModel.setData({columns: [
			]});

			this.getView().setModel(uiModel, "ui");

			this.table.addColumn(new sap.m.Column({
				header: new sap.m.Text({
					text: "Time"
				})
			}))

			$.get('/odata/v4/ScheduleService/Rooms?$orderby=name')
			.done(function(data) {
				var aColumns = uiModel.getProperty("/columns");
				data.value.forEach(r => {
					aColumns.push({
						name: r.name,
						id: r.ID
					})
					this.table.addColumn(new sap.m.Column({
						header: new sap.m.Text({
							text: r.name
						})
					}))
				});
				uiModel.setProperty("/columns", aColumns);
			}.bind(this));

			this.getView().getModel().attach
		},

		onBeforeRendering: function() {
			var oBinding = this.table.getBinding("items").filter()
			var today = new Date();

			var date = this.getDateFormatter().format(today);
			this.table.setHeaderText(date);
			oBinding.filter(
				new sap.ui.model.Filter("date", sap.ui.model.FilterOperator.EQ, date)
			);
		},
		handleCalendarSelect: function(oEvent) {
			var oBinding = this.table.getBinding("items");
			var selectedDate = oEvent.getParameter("newValue");
			this.table.setHeaderText(selectedDate);
			oBinding.filter(
				new sap.ui.model.Filter("date", sap.ui.model.FilterOperator.EQ, selectedDate)
			);
		},

		formatTimeRange: function(from, to) {
			if(!(from || to)) {
				return "";
			}
			var formatter = DateFormat.getDateInstance({
				pattern: "hh:mm"
			});
			return formatter.format(new Date(from)) + " - " + formatter.format(new Date(to));
		},

		buildItems: function(sId, oContext) {
			var object = oContext.getObject();
			var lineItem = new sap.m.ColumnListItem();
			var uiModel = this.getView().getModel("ui");
			if(!uiModel) {
				return lineItem;
			}
			var roomBookins = object.to_bookings;
			var timeRange = new sap.m.Text();
			timeRange.bindText({ 
				parts:['start','ends'],  
				formatter: this.formatTimeRange})
			lineItem.addCell(timeRange);

			for(var room of uiModel.getObject("/columns")) {
				var isBooked = roomBookins.some((booking) => booking.to_room_ID === room.id);
				
				var input = new sap.m.Input({
					value : isBooked ? "{name}" : "",
					change: this.submitBookingData
				});
				if(isBooked) {
					var booking = roomBookins.find(d => d.to_room_ID === room.id);
					input.bindContext("/Bookings("+ booking.ID +")");
				}
				input.data("roomId", room.id);
				lineItem.addCell(input);
			}
			
			return lineItem;
		},

		submitBookingData : function (oEvent) {
			if(!oEvent.getSource().getBinding("value")) {
				var oContext = oEvent.getSource().getBindingContext();
				var contextPath = oContext.getPath();
				var roomId = oEvent.getSource().data("roomId");
				var name = oEvent.getSource().getValue();
				var model = oEvent.getSource().getModel();
				var bc = model.bindContext(contextPath + "/ScheduleService.BookRoom(...)");
				bc.setContext(oContext);
				bc.setParameter("roomId", roomId);
				bc.setParameter("name", name);
				debugger;
				bc.execute().then(function(d){
					debugger;
				});
			}
		},
		onDataEvents : function (oEvent) {
			sap.ui.core.BusyIndicator.hide();
		},
		dataRequested : function (oEvent) {
			sap.ui.core.BusyIndicator.show(100);
		}
	});
});
