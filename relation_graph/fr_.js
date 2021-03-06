    /*
 * FastV (Javascript  libraries) 0.1.0
 * FRlayout algorims
 *
 * Author: xiaotian
 * Email: 18613505558@163.com
 * update Time 2020/10/29
 *================================================
 */


!(function(window){
  /*
  * FR布局算法
  @param nodes 节点集合
  @param links 边集合
  @autor xiaotian
  */
  var FRlayout = function(nodes,links){   
    
    this.nodes = nodes;
    this.links = links;
    
    this.AREA_MULTIPLICATOR = 10000;
    this.area = 200;         //画布大小
    this.gravity = 2.0;     // 引力
    this.SPEED_DIVISOR = 800.0;  //最大步长  speed的除数
    this.speed = 50; //速度
  }
  /*
  * newLayoutData 初始化布局数据
  @param nodes 节点集合
  @param links 边集合
  @autor xiaotian
  */
  FRlayout.prototype.newLayoutData = function(){
    var layoutData = {
      dx:0.0,  //增量 x
      dy:0.0,  
      // old_dx:0.0, //old增量
      // old_dy:0.0,
      freeze:0.0
    };
    return layoutData;
  }
  
  /*
  *newLayoutData 布局迭代
  @autor xiaotian
  */
  FRlayout.prototype.runLayout = function(){
    var i =0;
    while(i++ < 10){
      this.goAlgo();
    }
  }
  
  /*
  * initAlgo 初始化布局
  @autor xiaotian
  */
  FRlayout.prototype.initAlgo = function(){
    var _self = this;
    _self.area = _self.nodes.length / 2;
    _self.gravity = 2.0;
    
    _self.nodes.forEach(function(n){
      n.layoutData = _self.newLayoutData();
    });
  }
  
  /*
  * goAlgo 执行布局算法
  @autor xiaotian
  */
  FRlayout.prototype.goAlgo = function(){
    
    var _self = this;
    
    var nodes = _self.nodes;
    var nodeCount = nodes.length;
    
    var maxDisplace = Math.sqrt(_self.AREA_MULTIPLICATOR * _self.area) /10.0;  //最大长度 
    
    var k = Math.sqrt((_self.AREA_MULTIPLICATOR * _self.area) / (1.0 + nodeCount));   //弹簧系数

    nodes.forEach(function(N1,i){   //斥力计算
          
          N1.layoutData.dx = 0;
          N1.layoutData.dy = 0;
          
          nodes.forEach(function(N2,j){
            if(i != j){
              var xDist = N1.x - N2.x;
              var yDist = N1.y - N2.y;
              var dist = Math.sqrt(xDist * xDist + yDist * yDist);
              
              if(dist > 0){
                var repulsiveF = k * k /dist;
                var layoutData = N1.layoutData;
                
                layoutData.dx += (xDist /dist * repulsiveF);
                layoutData.dy += (yDist /dist * repulsiveF);
              }
            }
          });
    });
        
    var links = _self.links;
    links.forEach(function(E){   //引力计算
      var Nf = E.nodeA;
      var Nt = E.nodeB;
      
      var xDist = Nf.x - Nt.x;
      var yDist = Nf.y - Nt.y;
      
      var dist = Math.sqrt(xDist * xDist + yDist * yDist);
      var attractiveF = dist * dist / k;
      
      if(dist > 0){
        var sourceLayoutData = Nf.layoutData;
        var targetLayoutData = Nt.layoutData;
        
        sourceLayoutData.dx -= (xDist / dist * attractiveF);
        sourceLayoutData.dy -= (yDist / dist * attractiveF);
        targetLayoutData.dx += (xDist / dist * attractiveF);
        targetLayoutData.dy += (yDist / dist * attractiveF);
      }
    });
    
    nodes.forEach(function(n){ //最终距离
      
      var layoutData = n.layoutData;
      
      var d = Math.sqrt(n.x * n.x + n.y * n.y);
      var gf = 0.01 * k * _self.gravity * d;
      
      layoutData.dx -= gf * n.x /d;
      layoutData.dy -= gf * n.y /d;
      
      layoutData.dx *= _self.speed / _self.SPEED_DIVISOR;
      layoutData.dy *= _self.speed / _self.SPEED_DIVISOR;
      
      var dist = Math.sqrt(layoutData.dx * layoutData.dx + layoutData.dy * layoutData.dy);
      
      if(dist > 0){
        var limitedDist = Math.min(maxDisplace * (_self.speed / _self.SPEED_DIVISOR),dist);
        
        n.x += (layoutData.dx /dist * limitedDist);
        n.y += (layoutData.dy /dist * limitedDist);

      }
    });
  }
  
  window.FRlayout = FRlayout;
  
})(window);