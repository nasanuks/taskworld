/**
 * Created by Vorathep.Charoenporn on 8/6/2558.
 */
var Utility = Utility || {};
"use strict";
Utility = {
    generateKey: function(){ return Math.floor(Math.random()*10000); },
    renderHtml: function(tran){
        $("table#transaction tbody").append(
            $("<tr>")
                .append($("<td>").text(tran.name))
                .append($("<td>").text(tran.number))
                .append($("<td>",{class:"center"}).text(tran.type))
                .append($("<td>",{class:"center"}).text(tran.method))
                .append($("<td>",{class:"right"}).text((tran.amount * 1).toFixed(2)))
                .append($("<td>",{class:"right"}).text((tran.balance *1).toFixed(2)))
                .append($("<td>",{class:"center"}).text(tran.currency))
        );
    },
    validateAmount: function(amount){
        return $.isNumeric(amount)
    },
    validateWithdraw: function(amount,balance){
        return $.isNumeric(amount) && $.isNumeric(balance) && balance >= amount;
    },
    renderError: function(message){
        $("div.error .detail").prepend($("<p>").text((new Date()).toLocaleTimeString() + " " + message));
    }

}