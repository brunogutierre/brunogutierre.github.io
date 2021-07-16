(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\bruno\GIT\MyPersonalPage\src\main.ts */"zUnb");


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "Fa7f":
/*!***************************************************!*\
  !*** ./src/app/base/comps/face/face.component.ts ***!
  \***************************************************/
/*! exports provided: FaceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FaceComponent", function() { return FaceComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");


class FaceComponent {
    constructor() { }
    ngOnInit() {
    }
}
FaceComponent.ɵfac = function FaceComponent_Factory(t) { return new (t || FaceComponent)(); };
FaceComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FaceComponent, selectors: [["app-face"]], decls: 14, vars: 0, consts: [[1, "face-front"], [1, "face-title"], [1, "face-pointer-cont"], [1, "bar-left"], [1, "face-pointer", "pointer-left"], [1, "face-pointer", "pointer-right"], [1, "bar-right"], [1, "profile-cont"], [1, "face-profile"], [1, "face-projects"]], template: function FaceComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h1", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Welcome");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Profile");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "img");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: [".face-front[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 65%;\n  position: absolute;\n  min-height: 300px;\n  background: #26596e;\n  background: linear-gradient(166deg, #26596e 0%, #097961 35%, #d2f487 100%);\n  overflow: hidden;\n}\n.face-front[_ngcontent-%COMP%]   .face-title[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 50px;\n  padding-left: 0.5em;\n  font-size: 8em;\n  font-weight: bolder;\n  line-height: 0.7em;\n  margin: 0;\n}\n.face-front[_ngcontent-%COMP%]   .face-pointer-cont[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0px;\n  height: 50px;\n  width: 100%;\n  overflow: hidden;\n}\n.face-front[_ngcontent-%COMP%]   .face-pointer-cont[_ngcontent-%COMP%]   .face-pointer[_ngcontent-%COMP%] {\n  background-color: #fff;\n  position: absolute;\n  width: 100px;\n  height: 100px;\n  transform: rotate(45deg);\n}\n.face-front[_ngcontent-%COMP%]   .face-pointer-cont[_ngcontent-%COMP%]   .face-pointer.pointer-left[_ngcontent-%COMP%] {\n  left: calc(50% - 120px);\n}\n.face-front[_ngcontent-%COMP%]   .face-pointer-cont[_ngcontent-%COMP%]   .face-pointer.pointer-right[_ngcontent-%COMP%] {\n  right: calc(50% - 120px);\n}\n.face-front[_ngcontent-%COMP%]   .face-pointer-cont[_ngcontent-%COMP%]   .bar-left[_ngcontent-%COMP%], .face-front[_ngcontent-%COMP%]   .face-pointer-cont[_ngcontent-%COMP%]   .bar-right[_ngcontent-%COMP%] {\n  background-color: #fff;\n  position: absolute;\n  height: 50px;\n  width: calc(50% - 80px);\n}\n.face-front[_ngcontent-%COMP%]   .face-pointer-cont[_ngcontent-%COMP%]   .bar-left[_ngcontent-%COMP%] {\n  left: 0;\n}\n.face-front[_ngcontent-%COMP%]   .face-pointer-cont[_ngcontent-%COMP%]   .bar-right[_ngcontent-%COMP%] {\n  right: 0;\n}\n.profile-cont[_ngcontent-%COMP%] {\n  position: absolute;\n  top: max(65%, 300px);\n  width: 100%;\n  padding: 2em 8em;\n  box-sizing: border-box;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcZmFjZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLFdBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7RUFFQSxpQkFBQTtFQUVBLG1CQUFBO0VBQ0EsMEVBQUE7RUFFQSxnQkFBQTtBQUZKO0FBSUk7RUFDSSxrQkFBQTtFQUNBLFlBQUE7RUFFQSxtQkFBQTtFQUVBLGNBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBRUEsU0FBQTtBQUxSO0FBUUk7RUFDSSxrQkFBQTtFQUNBLFdBQUE7RUFFQSxZQUFBO0VBQ0EsV0FBQTtFQUVBLGdCQUFBO0FBUlI7QUFVUTtFQUNJLHNCQUFBO0VBQ0Esa0JBQUE7RUFFQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLHdCQUFBO0FBVFo7QUFXWTtFQUFpQix1QkFBQTtBQVI3QjtBQVNZO0VBQWtCLHdCQUFBO0FBTjlCO0FBU1E7RUFDSSxzQkFBQTtFQUNBLGtCQUFBO0VBRUEsWUFBQTtFQUNBLHVCQUFBO0FBUlo7QUFXUTtFQUFZLE9BQUE7QUFScEI7QUFTUTtFQUFhLFFBQUE7QUFOckI7QUFVQTtFQUNJLGtCQUFBO0VBQ0Esb0JBQUE7RUFFQSxXQUFBO0VBQ0EsZ0JBQUE7RUFFQSxzQkFBQTtBQVRKIiwiZmlsZSI6ImZhY2UuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZmFjZS1mcm9udCB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogNjUlO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG5cclxuICAgIG1pbi1oZWlnaHQ6IDMwMHB4O1xyXG5cclxuICAgIGJhY2tncm91bmQ6IHJnYigzOCw4OSwxMTApO1xyXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDE2NmRlZywgcmdiYSgzOCw4OSwxMTAsMSkgMCUsIHJnYmEoOSwxMjEsOTcsMSkgMzUlLCByZ2JhKDIxMCwyNDQsMTM1LDEpIDEwMCUpO1xyXG5cclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcblxyXG4gICAgLmZhY2UtdGl0bGUge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICBib3R0b206IDUwcHg7XHJcblxyXG4gICAgICAgIHBhZGRpbmctbGVmdDogMC41ZW07XHJcblxyXG4gICAgICAgIGZvbnQtc2l6ZTogOGVtO1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XHJcbiAgICAgICAgbGluZS1oZWlnaHQ6IDAuN2VtO1xyXG5cclxuICAgICAgICBtYXJnaW46IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLmZhY2UtcG9pbnRlci1jb250IHtcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgYm90dG9tOiAwcHg7XHJcblxyXG4gICAgICAgIGhlaWdodDogNTBweDtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuXHJcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuXHJcbiAgICAgICAgLmZhY2UtcG9pbnRlciB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDBweDtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMDBweDtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpO1xyXG5cclxuICAgICAgICAgICAgJi5wb2ludGVyLWxlZnQgeyBsZWZ0OiBjYWxjKDUwJSAtIDEyMHB4KTsgfVxyXG4gICAgICAgICAgICAmLnBvaW50ZXItcmlnaHQgeyByaWdodDogY2FsYyg1MCUgLSAxMjBweCk7IH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5iYXItbGVmdCwgLmJhci1yaWdodCB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHJcbiAgICAgICAgICAgIGhlaWdodDogNTBweDtcclxuICAgICAgICAgICAgd2lkdGg6IGNhbGMoNTAlIC0gODBweCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuYmFyLWxlZnQgeyBsZWZ0OiAwOyB9XHJcbiAgICAgICAgLmJhci1yaWdodCB7IHJpZ2h0OiAwOyB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi5wcm9maWxlLWNvbnQge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiBtYXgoNjUlLCAzMDBweCk7XHJcblxyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBwYWRkaW5nOiAyZW0gOGVtO1xyXG5cclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbn0iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FaceComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-face',
                templateUrl: './face.component.html',
                styleUrls: ['./face.component.scss']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class AppComponent {
    constructor() {
        this.title = 'MyPersonalPage';
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 4, vars: 0, consts: [[1, "float-icons"], ["href", "https://www.linkedin.com/in/bruno-gutierre/", "title", "My LinkedIn", 1, "fa-shadow"], [1, "fab", "fa-linkedin"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "i", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "router-outlet");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], styles: [".float-icons[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 20px;\n  top: 20px;\n  z-index: 1;\n}\n.float-icons[_ngcontent-%COMP%]   .fab[_ngcontent-%COMP%] {\n  font-size: 2em;\n}\n.float-icons[_ngcontent-%COMP%]   .fab.fa-linkedin[_ngcontent-%COMP%] {\n  color: #0a66c2;\n  box-shadow: 1px 1px 2px #666;\n  background-color: #eee;\n  padding: 0px 2px;\n}\n.float-icons[_ngcontent-%COMP%]   .fab.fa-linkedin[_ngcontent-%COMP%]:hover {\n  box-shadow: 1px 1px 4px #666;\n  background-color: #fff;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksa0JBQUE7RUFDQSxXQUFBO0VBQ0EsU0FBQTtFQUVBLFVBQUE7QUFBSjtBQUVJO0VBQ0ksY0FBQTtBQUFSO0FBRVE7RUFDSSxjQUFBO0VBRUEsNEJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0FBRFo7QUFHWTtFQUNJLDRCQUFBO0VBQ0Esc0JBQUE7QUFEaEIiLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmZsb2F0LWljb25zIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OiAyMHB4O1xyXG4gICAgdG9wOiAyMHB4O1xyXG5cclxuICAgIHotaW5kZXg6IDE7XHJcblxyXG4gICAgLmZhYiB7XHJcbiAgICAgICAgZm9udC1zaXplOiAyZW07XHJcblxyXG4gICAgICAgICYuZmEtbGlua2VkaW4ge1xyXG4gICAgICAgICAgICBjb2xvcjogcmdiKDEwLCAxMDIsIDE5NCk7XHJcblxyXG4gICAgICAgICAgICBib3gtc2hhZG93OiAxcHggMXB4IDJweCAjNjY2O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWVlO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAwcHggMnB4O1xyXG5cclxuICAgICAgICAgICAgJjpob3ZlciB7XHJcbiAgICAgICAgICAgICAgICBib3gtc2hhZG93OiAxcHggMXB4IDRweCAjNjY2O1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.scss']
            }]
    }], null, null); })();


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _base_comps_face_face_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./base/comps/face/face.component */ "Fa7f");






class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
        _base_comps_face_face_component__WEBPACK_IMPORTED_MODULE_4__["FaceComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [
                    _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                    _base_comps_face_face_component__WEBPACK_IMPORTED_MODULE_4__["FaceComponent"]
                ],
                imports: [
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                    _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"]
                ],
                providers: [],
                bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _base_comps_face_face_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base/comps/face/face.component */ "Fa7f");





const routes = [
    { path: './home', component: _base_comps_face_face_component__WEBPACK_IMPORTED_MODULE_2__["FaceComponent"] },
    { path: '**', component: _base_comps_face_face_component__WEBPACK_IMPORTED_MODULE_2__["FaceComponent"] }
];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "AytR");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map