(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{11:function(t,e,a){"use strict";a.r(e);a.d(e,"default",function(){return n});function r(t,e){if(!(t instanceof e)){throw new TypeError("Cannot call a class as a function")}}function i(t,e){for(var a=0;a<e.length;a++){var i=e[a];i.enumerable=i.enumerable||false;i.configurable=true;if("value"in i)i.writable=true;Object.defineProperty(t,i.key,i)}}function s(t,e,a){if(e)i(t.prototype,e);if(a)i(t,a);return t}var n=function(){function n(){var t=arguments.length>0&&arguments[0]!==undefined?arguments[0]:256;var e=arguments.length>1&&arguments[1]!==undefined?arguments[1]:256;r(this,n);this.canvas=document.querySelector(".canvasDemo");this.canvas.width=t;this.canvas.height=e;this.canvas.centerX=t/2;this.canvas.centerY=e/2;this.context2D=this.canvas.getContext("2d");this.context2D.imageSmoothingEnabled=false;this.buffer=this.context2D.createImageData(t,e);this.buffer.size=t*e*4;this.buffer.lineHeight=t*4;this.yIndex=[];for(var a=0;a<e;a++){this.yIndex[a]=a*t}this.turbulence=[];this.turbulenceIndex=0;for(var i=0;i<this.buffer.size/4;i++){this.turbulence[i]=Math.random()+.5;this.turbulence[i]*=(Math.cos(1/i)+1)/2}this.running=true;this.update()}s(n,[{key:"update",value:function t(){for(var e=0;e<this.canvas.width;e++){var a=Math.floor(Math.random()*255);var i=this.yIndex[this.canvas.height-1]+e<<2;this.buffer.data[i++]=a*1.6;this.buffer.data[i++]=a*.8;this.buffer.data[i++]=a*.4;this.buffer.data[i++]=255}for(var n=this.canvas.height-2;n>0;n--){for(var r=0;r<this.canvas.width;r++){var s=this.yIndex[n]+r-1<<2;var h=this.buffer.data[s++];var u=this.buffer.data[s++];var f=this.buffer.data[s++];s=this.yIndex[n]+r+1<<2;var d=this.buffer.data[s++];var o=this.buffer.data[s++];var c=this.buffer.data[s++];s=this.yIndex[n+1]+r<<2;var b=this.buffer.data[s++];var v=this.buffer.data[s++];var l=this.buffer.data[s++];var g=this.turbulence[(this.yIndex[n]+r+this.turbulenceIndex)%this.turbulence.length];s=this.yIndex[n]+r<<2;this.buffer.data[s++]=((h+d>>1)+b>>1)*g;this.buffer.data[s++]=((u+o>>1)+v>>1)*g;this.buffer.data[s++]=((f+c>>1)+l>>1)*g;this.buffer.data[s++]=255}}this.turbulenceIndex+=Math.floor(this.turbulence.length*Math.random());this.context2D.putImageData(this.buffer,0,0);if(this.running){window.requestAnimationFrame(this.update.bind(this))}}},{key:"stop",value:function t(){this.running=false}}]);return n}()}}]);