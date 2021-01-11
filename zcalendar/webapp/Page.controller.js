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

	var CalendarDayType = unifiedLibrary.CalendarDayType;
	var ValueState = coreLibrary.ValueState;
	var StickyMode = mobileLibrary.PlanningCalendarStickyMode;

	return Controller.extend("com.eae.zplanner.Page", {

		onInit: function() {
			// set explored app's demo model on this sample
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
			this.getView().setModel(oModel);

			var oModel = new JSONModel();
			oModel.setData({"Calendars" :[
				{
					"Date" : "Mon 19, 2021",
					"Timefrom" : "12:00",
					"TimeTo" : "13:00",
					"Room 1":{
						"isFree" : true,
						"name" : ""
					},
					"Room 2":{
						"isFree" : true,
						"name" : ""
					},
					"Room 3":{
						"isFree" : true,
						"name" : ""
					}
				},
				{
					"Date" : "Mon 19, 2021",
					"Timefrom" : "13:00",
					"TimeTo" : "14:00",
					"Room 1":{
						"isFree" : true,
						"name" : ""
					},
					"Room 2":{
						"isFree" : true,
						"name" : ""
					},
					"Room 3":{
						"isFree" : true,
						"name" : ""
					}
				},
				{
					"Date" : "Mon 20, 2021",
					"Timefrom" : "12:00",
					"TimeTo" : "13:00",
					"Room1":{
						"isFree" : true,
						"name" : "Masha"
					},
					"Room2":{
						"isFree" : true,
						"name" : ""
					},
					"Room3":{
						"isFree" : true,
						"name" : ""
					}
				},
				{
					"Date" : "Mon 20, 2021",
					"Timefrom" : "13:00",
					"TimeTo" : "14:00",
					"Room1":{
						"ZoomId" : "Room 1",
						"isFree" : true,
						"name" : "Masha"
					},
					"Room2":{
						"ZoomId" : "Room 2",
						"isFree" : true,
						"name" : ""
					},
					"Room3":{
						"ZoomId" : "Room 3",
						"isFree" : true,
						"name" : ""
					}
				},
				{
					"Date" : "Mon 21, 2021",
					"Timefrom" : "12:00",
					"TimeTo" : "13:00",
					"Room 1":{
						"isFree" : true,
						"name" : ""
					},
					"Room 2":{
						"isFree" : true,
						"name" : ""
					},
					"Room 3":{
						"isFree" : true,
						"name" : ""
					}
				}
			]});
			this.getView().setModel(oModel);

			// oModel = new JSONModel();
			// oModel.setData({allDay: false});
			// this.getView().setModel(oModel, "allDay");

			// oModel = new JSONModel();
			// oModel.setData({ stickyMode: StickyMode.None, enableAppointmentsDragAndDrop: true, enableAppointmentsResize: true, enableAppointmentsCreate: true });
			// this.getView().setModel(oModel, "settings");
		},

		_typeFormatter: function(sType) {
			var sTypeText = "",
				aTypes = this.getView().getModel().getData().supportedAppointmentItems;

			for (var  i = 0; i < aTypes.length; i++){
				if (aTypes[i].type === sType){
					sTypeText = aTypes[i].text;
				}
			}

			if (sTypeText !== ""){
				return sTypeText;
			} else {
				return sType;
			}
		}
	});
});
