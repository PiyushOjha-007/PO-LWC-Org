/***********************************************************************************
* File Name: CommunityMyCasesComponentHelper
* Description : The CLient Side Helper for CommunityMyCasesComponent
* @Author : Piyush Ojha Cisco 
* Created Date : 11-06-2019
* ***********************************************************************************/
({
   getCaseList: function(component,event,helper,statusValue) {
        var action = component.get("c.getCase");
        var statusValue = component.get("v.checkBoxvalue");
        // Set up the callback
        
        action.setParams({ "statusValue" : statusValue });
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('Response Time: '+((new Date().getTime())-requestInitiatedTime));
                var dataLength = response.getReturnValue().length;
                var pageSize = component.get("v.pageSize");
                var totalPages = Math.ceil(dataLength/pageSize);
                 component.set("v.totalPages", totalPages);
               // component.set("v.totalPages", Math.ceil(response.getReturnValue().length/component.get("v.pageSize")));
                component.set("v.allData", response.getReturnValue());
                component.set("v.currentPageNumber",1);
                
                helper.buildData(component, helper);
            }
        });
        var requestInitiatedTime = new Date().getTime();
        $A.enqueueAction(action);
    },
    getSearchCaseList: function(component) {
        
        var action=component.get('c.searchByText');
        const searchText = component.find("nameFilter").get("v.value");
        console.log('Here Inside the Seacrh Helper',searchText);
        action.setParams({"searchText": searchText});
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            //component.set("v.cases", response.getReturnValue());
            if(state == 'SUCCESS'){
                
               component.set("v.data", response.getReturnValue());
                console.log('In SUccess Helper 1 ',component.get("v.data"));
            }
            });
            $A.enqueueAction(action);
        
    },
    
    //Helper Method Define //
    
    
    
    /*
     * this function will build table data
     * based on current page selection
     * */
    buildData : function(component, helper) {
        
        var data = [];
        var pageNumber = component.get("v.currentPageNumber");
        var pageSize = component.get("v.pageSize");
        var allData = component.get("v.allData");
        var x = (pageNumber-1)*pageSize;
        //creating data-table data
        for(; x<=(pageNumber)*pageSize; x++){
            if(allData[x]){
            	data.push(allData[x]);
            }
        }
        component.set("v.data", data);
        
        helper.generatePageList(component, pageNumber);
    },
    
    /*
     * this function generate page list
     * */
    generatePageList : function(component, pageNumber){
        
        pageNumber = parseInt(pageNumber);
        var pageList = [];
        var totalPages = component.get("v.totalPages");
        if(totalPages > 1){
            if(totalPages <= 10){
                var counter = 2;
                for(; counter < (totalPages); counter++){
                    pageList.push(counter);
                } 
            } else{
                if(pageNumber < 5){
                    pageList.push(2, 3, 4, 5, 6);
                } else{
                    if(pageNumber>(totalPages-5)){
                        pageList.push(totalPages-5, totalPages-4, totalPages-3, totalPages-2, totalPages-1);
                    } else{
                        pageList.push(pageNumber-2, pageNumber-1, pageNumber, pageNumber+1, pageNumber+2);
                    }
                }
            }
        }
        
        component.set("v.pageList", pageList);
    },
   
 })