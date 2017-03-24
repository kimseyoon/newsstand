var ns = ns || {};

ns.view = {};
ns.view.headerObj = {
  init : function(){
    this.registerEvent();
  },

  registerEvent : function(){
    this.$header.addEventListener("click", function(e){
      e.preventDefault();
      var target = e.target;

      if(target.closest(".btnMove")){
        this.movePrevAndNext(target);
        return;
      }

      if(target.closest(".location li")){
        this.moveTab(target);
        return;
      }

    }.bind(this))
  },

  moveTab : function(target){
    var allLi = ns.util.$(".mainArea").children;
    var tabContId = target.getAttribute("href");
    for(var i = 0; i < allLi.length; i = i + 1){
      allLi[i].classList.remove("show");
    }
    ns.util.$(tabContId).classList.add("show");

    var statusView = target.closest("li").getAttribute("id");
    ns.dispatcher.emit({"type" : "changeStatusView"}, [statusView]);
  },

  movePrevAndNext : function(target){
    if(target.classList.contains("left")){
      ns.dispatcher.emit({"type" : "movePrevAndNext"}, ["prev"]);
    }else{
      ns.dispatcher.emit({"type" : "movePrevAndNext"}, ["next"]);
    }
  }

};
ns.view.Header = function(){
  return {
    $header : ns.util.$("header")
  }
}

ns.view.lnbObj = {
  init : function(){
    this.registerEvent();
  },

  registerEvent : function(){
    this.$lnb.addEventListener("click", function(e){
      var target = e.target;
      if(target.tagName === "LI"){
        this.moveClickedList(target);
      }
    }.bind(this));
  },

  moveClickedList : function(target){
    var index = ns.util.getChildOrder(target);
    ns.dispatcher.emit({"type" : "moveClickedList"}, [index]);
  },

  addSelectClass : function(index){
    var allLi = this.$lnb.children;
    for(var i = 0; i < allLi.length; i = i + 1){
      allLi[i].classList.remove("select");
    }
    allLi[index].classList.add("select");
  },

  showCurrentPage : function(index){
    var currentPage = ns.util.$(".currentPage");
    currentPage.innerHTML = index + 1;
  },

  //총페이지 넘버 출력
  showTotalPage : function(length){
    var totalPage = ns.util.$(".totalPage");
    totalPage.innerHTML = length;
  },

  renderView : function(data){
    var ulHtml = document.querySelector("#ulTemplate").innerHTML,
        result = "";
    for(var i = 0; i < data.length; i = i + 1){
      if(i === 0){
        result += "<li class='select' data-id='"+data[i].id+"'>"+data[i].title+"</li>";
        continue;
      }
      result += "<li data-id='"+data[i].id+"'>"+data[i].title+"</li>";
    }
    ulHtml = ulHtml.replace("{newsTitleList}", result);
    this.$lnb.innerHTML = ulHtml;
  }

};
ns.view.Lnb = function(){
  return {
    $lnb : ns.util.$(".mainArea nav ul")
  }
}

ns.view.contentObj = {
  init :function(){
    this.registerEvent();
  },

  registerEvent : function(){
    this.$content.addEventListener("click", function(e){
      var target = e.target;
      if(target.classList.contains("btnDelNews")){
        ns.dispatcher.emit({"type" : "cancelSubscription"});
      }
    })
  },

  renderView : function(data){
    var newsHtml = document.querySelector("#newsTemplate").innerHTML,
        str = "";

    if(data === undefined){
      this.$content.innerHTML = "";
      return;
    }

    newsHtml = newsHtml.replace("{title}", data.title).replace("{imgurl}", data.imgurl);
    for(var i = 0; i < data.newslist.length; i = i + 1){
      str += "<li>"+data.newslist[i]+"</li>"
    }
    newsHtml = newsHtml.replace("{newsList}", str);
    this.$content.innerHTML = newsHtml;
  }
};

ns.view.Content = function(){
  return {
    $content : ns.util.$(".mainArea .content")
  }
};

ns.view.totalPressObj = {
  init : function(){
    this.registerEvent();
  },

  registerEvent : function(){
    this.$totalPressArea.addEventListener("click", function(e){
      var target = e.target;

      if(target.closest(".btnSbscription")){
        this.changeSubscription(target);
      }
    }.bind(this));
  },

  changeSubscription : function(target){
    var dataId = target.getAttribute("data-id");
    if(target.classList.contains("yes")){
      ns.dispatcher.emit({"type" : "changeSubscription"}, [dataId, "yes"]);
    }else{
      ns.dispatcher.emit({"type" : "changeSubscription"}, [dataId, "no"]);
    }
  },

  renderView : function(data){
    var pressListHtml =  ns.util.$("#pressListTemplate").innerHTML,
        result = "",
        str = "";
    for(var i = 0; i < data.length; i++){
      result += pressListHtml.replace("{title}", data[i].title);
      if(data[i].subscription === "yes"){
        str = "<a href='#' class='no' data-id='"+data[i].id+"'>해지</a>"
      }else{
        str = "<a href='#' class='yes' data-id='"+data[i].id+"'>구독</a>"
      }
      result = result.replace("{btnList}", str);
    }
    var pressList = ns.util.$(".totalPressArea .pressList");
    pressList.innerHTML = result;
  }
};

ns.view.TotalPress = function(){
  return {
    $totalPressArea : ns.util.$(".totalPressArea")
  }
};

ns.modelObj = {
  setSubscriptionListData : function(data){
    function _checkSubscription(item){
      return item.subscription === "yes";
    }
    this.subscriptionList = data.filter(_checkSubscription);
  },

  setCurrentContentIndex : function(index){
    this.currentContentIndex = index;
  },

  getCurrentContentIndex : function(){
    return this.currentContentIndex;
  },

  getAllDataLength : function(){
    return this.subscriptionList.length;
  },

  getAllData : function(){
    return this.subscriptionList;
  },

  getTargetData : function(index){
    return this.subscriptionList[index];
  },

  getAllTitleList : function(){
    var titleArr = [];
    this.subscriptionList.forEach(function(item){
      titleArr.push(item.title);
    })
    return titleArr;
  },
/*
  removeData : function(index){
    this.subscriptionList.splice(index, 1);
  },
*/
  setTotalPressListData : function(data){
    this.totalPresslList = data;
  },

  getTotalPressListData : function(data){
    return this.totalPresslList;
  },

  setSubscription : function(dataId, subscription){
    var dataId = parseInt(dataId);
    this.totalPresslList.forEach(function(item){
      if(item.id === dataId){
        item.subscription = subscription;
      }
    })
    this.setSubscriptionListData(this.totalPresslList);
  },

  getIdOfCurrentContent : function(){
    var titleList = ns.util.$(".myNewsArea nav ul").children;
    return titleList[this.currentContentIndex].getAttribute("data-id");
  },

  setStatusView : function(status){
    this.statusView = status;
  },

  getStatusView : function(){
    return this.statusView;
  },



  setTotalViewPage : function(){
    var LISTNUM = 12;
    var totalPressList = this.totalPresslList;
    this.totalViewPage = Math.floor(totalPressList.length / LISTNUM) + 1;
  },

  getTotalViewPage : function(){
    return this.totalViewPage;
  },


  setTotalViewPageArr : function(){
    var LISTNUM = 12;
    var totalPressList = this.totalPresslList;
    this.setTotalViewPage();
  //  var page = Math.floor(totalPressList.length / LISTNUM) + 1;
    var num = 0;
    //debugger;
    for(var i = 0; i < this.totalViewPage; i++){
      this.totalViewPageArr[i] = totalPressList.slice(num * LISTNUM, (num + 1) * LISTNUM);
      num++;
    }
  },

  getTotalViewPageArr : function(){
    return this.totalViewPageArr;
  },

  getTotalViewPageArrPiece : function(index){
    return this.totalViewPageArr[index];
  },

  getTotalViewCurrentPage : function(){
    return this.totalViewCurrentPage;
  },

  setTotalViewCurrentPage : function(index){
    this.totalViewCurrentPage = index
  }

/*
  getInitViewData : function(index){
    var titleArr = this.getAllTitleList();
    var targetData = this.getTargetData(index);
    ns.dispatcher.emit({"type" : "lnbContentViewRender"}, [titleArr, targetData]);
  },
*/
};

ns.Model = function(){
  return{
    totalPresslList : [],
    subscriptionList : [], // 구독리스트
    currentContentIndex : 0,
    statusView : "",
    totalViewPageArr : [],
    totalViewPage : 0,
    totalViewCurrentPage : 0
  }
}

ns.controllerObj = {
  init : function(){
    ns.dispatcher.emit({"type" : "initView"});
  },

  chain : function(){
    ns.dispatcher.register({
      "lnbContentViewRender" : function(subscriptionAllData, targetAllData){
        this.lnbView.showCurrentPage(this.model.getCurrentContentIndex());
        this.lnbView.showTotalPage(this.model.getAllDataLength());
        this.lnbView.renderView(subscriptionAllData);
        this.contentView.renderView(targetAllData);
      }.bind(this),

      "movePrevAndNext" : function(direction){
        var statusView = this.model.getStatusView();
        if(statusView === "myNews"){
          ns.dispatcher.emit({"type" : "moveContent"}, [direction]);
        }else{
          ns.dispatcher.emit({"type" : "moveTotalView"}, [direction]);
        }
      }.bind(this),

      "moveContent" : function(direction){
        var contentIndex = this.model.getCurrentContentIndex();
        var titleDataLength = this.model.getAllTitleList().length;
        var targetData = "";

        if(titleDataLength === 0){
          return;
        }

        if(direction === "prev"){
          contentIndex--;
          if(contentIndex === -1){
            contentIndex = titleDataLength - 1;
          }
        }else{
          contentIndex++;
          if(contentIndex >= titleDataLength){
            contentIndex = 0;
          }
        }
        targetData = this.model.getTargetData(contentIndex);
        this.model.setCurrentContentIndex(contentIndex);
        this.lnbView.showCurrentPage(contentIndex);
        this.lnbView.addSelectClass(contentIndex);
        this.contentView.renderView(targetData);
      }.bind(this),

      "moveTotalView" : function(direction){
        //ns.dispatcher.emit({"type" : "totalPressViewRender"}, [this.model.getTotalViewPageArrPiece(0)]);

        var totalPage = this.model.getTotalViewPage();
        var currentPage = this.model.getTotalViewCurrentPage();

        if(direction === "prev"){
          currentPage--;
          if(currentPage === -1){
            currentPage = totalPage - 1;
          }
        }else{
          currentPage++;
          if(currentPage >= totalPage){
            currentPage = 0;
          }
        }
        //console.log(currentPage);

        ns.dispatcher.emit({"type" : "totalPressViewRender"}, [this.model.getTotalViewPageArrPiece(currentPage)]);
        this.model.setTotalViewCurrentPage(currentPage);

        //ns.dispatcher.emit({"type" : "totalPressViewRender"}, [this.model.getTotalViewPageArrPiece(index)]);
        //this.model.setTotalViewCurrentPage(index);

      }.bind(this),

      "cancelSubscription" : function(){
        var contentIndex = this.model.getCurrentContentIndex();
        //this.model.removeData(contentIndex);
        var currentContentId= this.model.getIdOfCurrentContent();
        this.model.setSubscription(currentContentId, "no");
        this.model.setCurrentContentIndex(0);

        this.model.setSubscriptionListData(this.model.getTotalPressListData());

        //this.model.getInitViewData(0);
        //ns.dispatcher.emit({"type" : "totalPressViewRender"}, [this.model.getTotalPressListData()]);
        ns.dispatcher.emit({"type" : "totalPressViewRender"}, [this.model.getTotalViewPageArrPiece(0)]);
        ns.dispatcher.emit({"type" : "lnbContentViewRender"}, [this.model.getAllData(), this.model.getTargetData(0)]);
      }.bind(this),

      "moveClickedList" : function(index){
        var targetData = this.model.getTargetData(index);
        this.model.setCurrentContentIndex(index);
        this.lnbView.showCurrentPage(this.model.getCurrentContentIndex());
        this.lnbView.addSelectClass(index);
        this.contentView.renderView(targetData);
      }.bind(this),

      "totalPressViewRender" : function(data){
        this.totalPressView.renderView(data);
      }.bind(this),

      "changeSubscription" : function(dataId, subscription){
        this.model.setSubscription(dataId, subscription);
        //ns.dispatcher.emit({"type" : "totalPressViewRender"}, [this.model.getTotalPressListData()]);
        ns.dispatcher.emit({"type" : "totalPressViewRender"}, [this.model.getTotalViewPageArrPiece(0)]);
        ns.dispatcher.emit({"type" : "lnbContentViewRender"}, [this.model.getAllData(), this.model.getTargetData(0)]);

        ns.util.runAjax(function(e){
          var result = JSON.parse(xhr.responseText);
          console.log(result);
        }, "POST", "http://localhost:3000/news/set_subscription", {"pressid" : dataId, "subscription" : subscription})

      }.bind(this),

      "changeStatusView" : function(status){
        this.model.setStatusView(status);
      }.bind(this),

      "initView" : function(){
        this.headerView.init();
        this.lnbView.init();
        this.contentView.init();
        this.totalPressView.init();

        //ns.dispatcher.emit({"type" : "totalPressViewRender"}, [this.model.getTotalPressListData()]);
        ns.dispatcher.emit({"type" : "totalPressViewRender"}, [this.model.getTotalViewPageArrPiece(0)]);
        //this.model.getInitViewData(this.model.getCurrentContentIndex());
        ns.dispatcher.emit({"type" : "lnbContentViewRender"}, [this.model.getAllData(), this.model.getTargetData(0)]);
      }.bind(this)
    })
  }
};

ns.Controller = function(obj){
  return {
    headerView : obj.headerView,
    lnbView : obj.lnbView,
    contentView : obj.contentView,
    totalPressView :obj.totalPressView,
    model : obj.model
  }
}

ns.util = {
  $ : function(ele){
    return document.querySelector(ele);
  },

  //ajax호출하기
  runAjax : function(func, method, url, data){
    var oReq = new XMLHttpRequest();

    oReq.addEventListener("load", func);
    oReq.open(method, url);

    if(method === "GET"){
      oReq.send();
    }else if(method === "POST"){
      data = JSON.stringify(data);
      oReq.setRequestHeader("content-Type", "application/json");
      oReq.send(data);
    }
  },

  getChildOrder: function(elChild) {
    const elParent = elChild.parentNode;
    let nIndex = Array.prototype.indexOf.call(elParent.children, elChild);
    return nIndex;
  }
};

ns.dispatcher = {
  register: function(fnlist) {
    this.fnlist = fnlist;
  },
  emit: function(o, data) {
    this.fnlist[o.type].apply(null, data);
  }
}

document.addEventListener("DOMContentLoaded", function(){
  var model = ns.Model();
  Object.setPrototypeOf(model, ns.modelObj);

  var headerView = ns.view.Header();
  Object.setPrototypeOf(headerView, ns.view.headerObj);

  var lnbView = ns.view.Lnb();
  Object.setPrototypeOf(lnbView, ns.view.lnbObj);

  var contentView = ns.view.Content();
  Object.setPrototypeOf(contentView, ns.view.contentObj);

  var totalPressView = ns.view.TotalPress();
  Object.setPrototypeOf(totalPressView, ns.view.totalPressObj);

  var control = ns.Controller({
    headerView : headerView, lnbView : lnbView, contentView : contentView, totalPressView : totalPressView, model : model
  });
  Object.setPrototypeOf(control, ns.controllerObj);

  control.chain();

  ns.util.runAjax(function(e){
    var data = JSON.parse(e.target.responseText);
    //console.log(data);
    //parsing(data)


    model.setTotalPressListData(data);
    model.setSubscriptionListData(data);

    model.setStatusView("total");
    model.setTotalViewPageArr();

    control.init();

  }, "GET", "http://localhost:3000/news/load_data")
});
/*
function parsing(data){

  //console.log(data)
  var totalPressList = [];
/*
  data[0].forEach(function(item, index){
    totalPressList.push({
      "id" : item.PRESSID,
      "subscription" : item.SUBSCRIPTION,
      "title" : item.PRESSTITLE,
      "imgurl" : item.IMGURL,
      "newslist" : []
    })

    data[1].forEach(function(item, index){
      console.log(totalPressList[].id)
    })
  })

  for(var i = 0; i < data[0].length; i++){
    totalPressList.push({
      "id" : data[0][i].PRESSID,
      "subscription" : data[0][i].SUBSCRIPTION,
      "title" : data[0][i].PRESSTITLE,
      "imgurl" : data[0][i].IMGURL,
      "newslist" : []
    })

    for(var x = 0; x < data[1].length;x++){
      if(totalPressList[i].id === data[1][x].PID){
        totalPressList[i].newslist.push(data[1][x].NEWSTITLE);
      }
    }
  }

  console.log(totalPressList)

  //console.log(data[1])


  //console.log(data)
  var totalPresslList = [];

  var flag = "";
  data.forEach(function(item, index){
    //console.log(item)
    if(flag !== item.PRESSID){
      totalPresslList.push({
        "id" : item.PRESSID,
        "subscription" : item.SUBSCRIPTION,
        "title" : item.PRESSTITLE,
        "imgurl" : item.IMGURL,
        "newslist" : []
      });
      flag = item.PRESSID;
    }
  })
  var pressNewsList = [];
  var newsList
  flag = "";
  data.forEach(function(item, index){
    pressNewsList.push({
      "pressId" : item.PID,
      "newsListArr" : []
    })
  })
  //console.log(pressNewsList)
  console.log(totalPresslList)
  //var pressArr = [];


}
*/
