var CoreModule = CoreModule || {};

(function(module){
  "use strict";
  /* Account class
  * This should be called from other. Don't call it directly.
  */
  module.Account = function () {
    var view = undefined;
    return {
      balance:0.00,
      name:undefined,
      number:undefined,
      currency: undefined,
      init: function (data) {
        view = this;
        // load initial data into Model
        if(data){
          view.balance = data.balance * 1;
          view.name = data.name;
          view.number = data.number;
          view.currency = data.currency;
        }
      },
      /* deposit
      * param list:
      * amount, currency
      * */
      deposit : function (param) {
        if(!Utility.validateAmount(param.amount)){
          Utility.renderError("Deposit failed, Amount is not valid numeric");
          return;
        }
        view.balance = view.balance + (param.amount * 1.0);
        var message = view.name + " deposit:"+ param.amount+" successfully";
        var transaction = {
          name:view.name,
          number:view.number,
          currency:view.currency,
          type:view.type,
          balance:view.balance,
          amount:param.amount,
          method:"deposit"
        };
        Utility.renderHtml(transaction);
        updateBalanceInLocalStorage(transaction);
        writeTransactionLog(transaction);
        //view.enquiryBalance();
      },
      withdraw : function (param) {
        if(!Utility.validateWithdraw(param.amount,view.balance)){
          Utility.renderError("Withdraw failed. Amount must be numeric and less than balance");
          return;
        }
        view.balance = view.balance - (param.amount * 1.0);
        var message = view.name + " withdraw:"+ param.amount+" successfully";
        var transaction = {
          name:view.name,
          number:view.number,
          currency:view.currency,
          type:view.type,
          balance:view.balance,
          amount:param.amount,
          method:"withdraw"
        };
        Utility.renderHtml(transaction);
        updateBalanceInLocalStorage(transaction);
        writeTransactionLog(transaction);
        //view.enquiryBalance();
      },
      enquiryBalance: function(){
        var message = view.name + " balance:"+view.balance;
        //return view.balance;
        //Utility.renderHtml(message);
      }
    };
  };
  /*Saving Account inherit from account*/
  module.Account.Saving = function(){
    return $.extend({type:"saving"},new module.Account());
  };
  /*Current Account inherit from account*/
  module.Account.Current = function(){
    return $.extend({type:"current"},new module.Account());
  };

  /* Create new account
  * param list
  * name: string
  * type: current/saving
  * */
  module.registerAccount = function (registerParam) {
    var account;
    if(registerParam){
      if(!registerParam.name){
        return null;
      }
    }
    var type = registerParam.type.toLowerCase();
    if(type === "saving"){
      account =  module.Account.Saving();
    }
    else if(type === "current") {
      account =  module.Account.Current();
    }
    else{
      /* error */
    }
    account.name = registerParam.name;
    account.number = Utility.generateKey();
    account.currency = registerParam.currency;
    account.init();
    addAccountToLocalStorage(account);
    return account;
  };
  /* load all existing account from local storage*/
  module.loadExistingAccount = function (){
    var list = Object.keys(localStorage);
    // skip "transaction" as reserved key.
    return _.without(list,"transaction");
  };
  /* delete account from local storage */
  module.deleteAccount = function(accountName){
    localStorage.removeItem(accountName);
    return true;
  };
  /* find existing account with parameter eg: name*/
  module.findAccount = function(param){
    if(param){
      var accountParam = JSON.parse(localStorage.getItem(param.name));
      var account = undefined;
      if(accountParam.type === "saving"){
        account =  module.Account.Saving();
      }
      else if(accountParam.type === "current") {
        account =  module.Account.Current();
      }

      account.init(accountParam);
      return account;
    }
  };

  /* private function add account to local storage*/
  var addAccountToLocalStorage = function(account){
    // Save in browser memory
    localStorage.setItem(account.name,JSON.stringify(account));
    return true;
  };
  /* write down transaction log in local storage */
  var writeTransactionLog = function(tran){
    // retrieve existing transaction or create new array in case of null
    var currentTran = JSON.parse(localStorage.getItem("transaction")) || [];
    if(tran)
    {
      // log date
      tran.logDate = (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString();
      // add transaction to history
      currentTran.push(tran);
      // update transaction history back to local storage
      localStorage.setItem("transaction",JSON.stringify(currentTran));
    }
  };
  /* Update latest balance in account in local storage */
  var updateBalanceInLocalStorage = function (tran){
    if(tran){
      var account = JSON.parse(localStorage.getItem(tran.name));
      account.balance = tran.balance;
      localStorage.setItem(tran.name,JSON.stringify(account));
    }
  };
})(CoreModule);


