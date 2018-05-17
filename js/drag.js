(function(w){
	
		w.Cdrag=function (panner,callback) {
			//快速划屏，橡皮筋，即点即停
//			var panner = document.querySelector('.wrapper');
//			var pannerList = document.querySelector('.content');
			var Tween = {
			
				Linear: function(t,b,c,d){ return c*t/d + b; },
				
				easeOut: function(t,b,c,d,s){
		        if (s == undefined) s = 1.70158;
		        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		        },
			}
			var pannerList =panner.children[0]
			transformCss(pannerList,'translateZ',0.01);
			//声明所有变量
			var eleY = 0;
			var startY =0;
			var disY = 0;
			//开始结束位置和时间
			var beginPoint = 0;
			var beginTime = 0;
			var endPoint = 0;
			var endTime = 0;
			var disPoint = 0;
			var disTime = 0;
			//解决手指一点一抬以后，speed为NaN
			//var disTime = 1;
			
			//防抖动
			var startX=0
			var isFirst=true
			var isY=true
			
			panner.addEventListener('touchstart',function  (event) {
				
				var touch = event.changedTouches[0];
				
				clearInterval(pannerList.timer);
				//清除过度时间
				pannerList.style.transition = 'none';
				//start时元素位置
				eleY = transformCss(pannerList,'translateY');
				startY = touch.clientY;
				startX=touch.clientX;
				//开始位置和时间
				beginPoint = transformCss(pannerList,'translateY');
				
				beginTime = new Date().getTime();
				
				//解决当我做一个完整的拖拽过程，然后我再去点击ul,speed = disVal/disTime还存在
				//disPoint = 0;
				if(callback&&callback['start']){
					callback['start']()
				}
				isFirst=true
				isY=true
			});
			
			panner.addEventListener('touchmove',function  (event) {
				var touch = event.changedTouches[0];
				if(!isY){
					return
				};
				var nowY = touch.clientY;
				disY = nowY - startY;
				
				var nowX=touch.clientX
				var disX=nowX-startX
				
				if(isFirst){
					isFirst=false
					if(Math.abs(disX)>Math.abs(disY)){
						isY=false
					}
				};
				
				var translateY = eleY+disY;
				//minWidth，负值
				var minWidth = document.documentElement.clientHeight-pannerList.offsetHeight;
				
				//判断限定范围，实现越拖越难效果
				if (translateY>0) {
					//算法比例
					var scale = 0.9 - translateY/document.documentElement.clientHeight;
					translateY = translateY*scale;
					
				} else if(translateY<minWidth){
					//右侧允许最大为over
					var over = minWidth - translateY;
					var scale = 0.9 - over/document.documentElement.clientHeight;
					translateY = minWidth-(over*scale);
				}
				transformCss(pannerList,'translateY',translateY)
				
				if(callback&&callback['move']){
					callback['move']()
				}
			});
			
			panner.addEventListener('touchend',function  (event) {
				//结束是偏移位置和时间
				endPoint = transformCss(pannerList,'translateY');
				endTime = new Date().getTime();
				//开始和结束差值
				disPoint = endPoint - beginPoint;
				
				disTime = endTime - beginTime;
				
				var minWidth = document.documentElement.clientHeight-pannerList.offsetHeight;
				//计算速度
				var speed = disPoint/disTime;
				//解决手指一点一抬以后，speed为NaN，方案之一
				//var speed = disPoint/(endTime - beginTime);
				//目标位置
				var target = transformCss(pannerList,'translateY')+speed*150;
				var type = 'Linear';
				
				//var bazier = '';
				if (target>0) {
					target = 0;
					
					type = 'easeOut';
					//cubic-bezier(0,1.42,1,1.44)
					//不要过度，快速回弹
					//bazier = 'cubic-bezier(0,1.42,1,1.44)'
					//transformCss(pannerList,'translateY',target);
				} else if(target<minWidth){
					
					target = minWidth;
					
					type = 'easeOut';
					//bazier = 'cubic-bezier(0,1.42,1,1.44)'
					
					
				};
				
				//pannerList.style.transition = "5s "+bazier;
				//transformCss(pannerList,'translateY',target);
				
				
				var time = 3;
				
				
				move(target,type,time);
				
				
			})
			
			function move (target,type,time) {
				clearInterval(pannerList.timer);
				var t = 0;
				var b = transformCss(pannerList,'translateY');
				var c = target - b;
				var d = time / 0.02;
				var s = 3;
				
				pannerList.timer = setInterval(function  () {
					
					t++;
					
					if (t>d) {
						if(callback&&callback['end']){
							callback['end']()
						}
						clearInterval(pannerList.timer);
						
					} else{
						if(callback&&callback['move']){
							callback['move']()
						}
						var point = Tween[type](t,b,c,d,s);
						transformCss(pannerList,'translateY',point);
					}
					
				},20)
				
			}
		}
	
})(window)
