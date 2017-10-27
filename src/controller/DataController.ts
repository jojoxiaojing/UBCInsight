import {InsightResponse} from "./IInsightFacade";
import Log from "../Util";

import {ASTNode, TreeAdapter, ASTAttribute} from 'parse5/index';
import {isUndefined} from "util";

var JSZip = require("jszip");
var fs = require("fs");
var http = require("http");
const parse5 = require('parse5');
var request = require('request');

interface Course {
    courses_dept: string;
    courses_id: string;
    courses_avg: number;
    courses_instructor: string;
    courses_title: string;
    courses_pass: number;
    courses_fail: number;
    courses_audit: number;
    courses_uuid: string;
    courses_year: number;
}

export interface Room {
    rooms_fullname: string; //Full building name (e.g., "Hugh Dempster Pavilion").
    rooms_shortname: string; //Short building name (e.g., "DMP").
    rooms_number: string; //The room number. Not always a number, so represented as a string.
    rooms_name: string; //The room id; should be rooms_shortname+"_"+rooms_number. "DMP_301"
    rooms_address: string; //The building address. (e.g., "6245 Agronomy Road V6T 1Z4").
    rooms_lat: number; //The latitude of the building. Instructions for getting this field are below.
    rooms_lon: number; //The longitude of the building. Instructions for getting this field are below.
    rooms_seats: number; //The number of seats in the room.
    rooms_type: string; //The room type (e.g., "Small Group").
    rooms_furniture: string; //The room type (e.g., "Classroom-Movable Tables & Chairs").
    rooms_href: string; //The link to full details online (e.g., "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201").

}

export default class DataController {
    dataInMemory: Map<string, any[]>;

    constructor() {
        this.dataInMemory = new Map<string, any[]>();
    }

    public loadDataset(id: string): any {

        var fs = require("fs");
        let ifFileExist = fs.existsSync(__dirname + "/" + id + '.txt');
        // check if file is in disk
        if (!ifFileExist) {
            return null;
        }

        // check if file is in memory
        if (!this.dataInMemory.has(id)) {
            var data = fs.readFileSync(__dirname + "/" + id + '.txt', "utf8");
            this.dataInMemory.set(id, JSON.parse(data));
        }

        return this.dataInMemory.get(id);
    }

    public processCourses(id: string, content: any): Promise<boolean> {
        let that = this;
        return new Promise<boolean>((fullfill, reject) =>{
            try {
                JSZip.loadAsync(content, {base64: true}).then(function (zip: any) {
                    let promiseArr: Array<Promise<any>> = new Array();
                    let parseResult: any[] = new Array();
                    let promiseAllResult: any[] = new Array();
                    for (let key in zip.files) {
                        if (zip.file(key)) {
                            let contentInFIle = zip.file(key).async("string");
                            promiseArr.push(contentInFIle);
                        }
                    }

                    Promise.all(promiseArr).then((value: any) => {
                        let i = value;
                        for (let i of value) {
                            try {
                                let m = JSON.parse(i);
                                parseResult.push(m);
                            }
                            catch (err) {
                                //do nothing here
                            }
                        }

                        for (let i of parseResult) {
                            let courseData: Array<any> = i.result;
                            for (let c of courseData) {
                                let m: Course = {
                                    courses_dept: c.Subject,
                                    courses_id: c.Course,
                                    courses_avg: c.Avg,
                                    courses_instructor: c.Professor,
                                    courses_title: c.Title,
                                    courses_pass: c.Pass,
                                    courses_fail: c.Fail,
                                    courses_audit: c.Audit,
                                    courses_uuid: c.id,
                                    courses_year: c.Year
                                };
                                if (c.Section === "overall") {
                                    m.courses_year = 1900
                                } else {
                                    m.courses_year = +m.courses_year
                                }
                                promiseAllResult.push(m);
                            }
                        }
                        let m = promiseAllResult;

                        if (m.length === 0) {
                            //throw new Error("Dataset is empty")
                            reject(false)
                        } else {
                            //update the in memory file
                            let ifFileExist = fs.existsSync(__dirname + "/" + id + '.txt');
                            if (!ifFileExist) {
                                fs.writeFileSync(__dirname + "/" + id + '.txt', JSON.stringify(m), 'utf-8');
                            }
                            that.dataInMemory.set(id, m)
                            fullfill(true);
                        }

                    }).catch(function (err: any) {
                        reject(false);
                    });

                }).catch(function (err: any) {
                    reject(false);
                });
            } catch (err) {
                reject(false)
            }
        });
    }

    public processRooms(id: string, content: any): Promise<boolean> {
        let that = this;

        const buildFindTableAttr: string = "views-table cols-5 table";
        const roomFullNameAttr: string = "views-field views-field-title";
        const roomFullName2Attr: string = "Building Details and Map";
        const roomShortnameAttr: string = "views-field views-field-field-building-code";
        const roomAddressAttr: string = "views-field views-field-field-building-address";
        const roomNumAttr: string = "views-field views-field-field-room-number";
        const roomCapacityAttr: string = "views-field views-field-field-room-capacity";
        const roomFurTypeAttr: string = "views-field views-field-field-room-furniture";
        const roomTypeAttr: string = "views-field views-field-field-room-type";
        const roomMoreDetailAttr: string = "views-field views-field-nothing";
        const roomsFindTable: string = "views-table cols-5 table";

        return new Promise<boolean>((fullfill, reject) => {

            JSZip.loadAsync(content, {base64: true}).then((zip: any) => {

                zip.file("index.htm").async("string").then((value: any) => {
                    const document: ASTNode = parse5.parse(value);
                    let targetTable: ASTNode = that.findElementByAttri(document, buildFindTableAttr);
                    let targetBuildList: ASTNode[] = that.findElementBynodeName(targetTable, "tbody").childNodes;
                    let listForRooms: Promise<any>[] = [];
                    for (let m of targetBuildList) {
                        if (m.nodeName === "tr") {
                            //assign value to rooms_fullname
                            let fullNameNode: ASTNode = that.findElementByAttri(m, roomFullNameAttr);
                            let fullNameAndUlrNode: ASTNode = that.findElementByAttri(fullNameNode, roomFullName2Attr);
                            let build_fullname: string = fullNameAndUlrNode.childNodes[0].value.trim();
                            //assign value to rooms_shortname
                            let build_shortname: string = that.findElementByAttri(m, roomShortnameAttr).childNodes[0].value.trim();
                            //assign value to rooms_address
                            let build_address: string = that.findElementByAttri(m, roomAddressAttr).childNodes[0].value.trim();
                            let build_lat: number = null;
                            let build_lan: number = null;

                            //for each building, return a promise
                            let p = new Promise<any>((fullfill, reject) => {
                                // assign value to rooms_lat and rooms_lan
                                request("http://skaha.cs.ubc.ca:11316/api/v1/team45/" + encodeURI(build_address), (error: any, response: any, body: any) => {
                                    if (error) {
                                        throw error;
                                    }
                                    let latlan = JSON.parse(body);
                                    build_lat = latlan.lat;
                                    build_lan = latlan.lon;

                                    //Read files for each building
                                    zip.files["campus/discover/buildings-and-classrooms/" + build_shortname].async("string").then((value: any) => {
                                        let roomsDoc = parse5.parse(value);
                                        let tableOfRooms: ASTNode = that.findElementByAttri(roomsDoc, roomsFindTable);
                                        if (tableOfRooms) {
                                            let listOfRooms111: Array<any> = [];
                                            let targetRoomTr: ASTNode[] = that.findElementBynodeName(tableOfRooms, "tbody").childNodes;
                                            //for each room in a building, get the data from each row in the table and fullfill the whole list of all rooms
                                            for (let each of targetRoomTr) {

                                                if (each.nodeName === "tr") {
                                                    let roomNum = that.findElementByAttri(each, roomNumAttr).childNodes[1].childNodes[0].value.trim();
                                                    let roomName = build_shortname + "_" + roomNum;
                                                    let roomSeats = JSON.parse(that.findElementByAttri(each, roomCapacityAttr).childNodes[0].value.trim());
                                                    let roomType = that.findElementByAttri(each, roomTypeAttr).childNodes[0].value.trim();
                                                    let roomFurType = that.findElementByAttri(each, roomFurTypeAttr).childNodes[0].value.trim();
                                                    let roomMoreDetail = that.findElementByAttri(each, roomMoreDetailAttr).childNodes[1].attrs[0].value;

                                                    let r = that.setRoom(build_fullname, build_shortname, roomNum, roomName, build_address, build_lat, build_lan, roomSeats, roomType, roomFurType,roomMoreDetail);
                                                    if(r){
                                                        listOfRooms111.push(r);
                                                    }
                                                }
                                            }
                                            fullfill(listOfRooms111);
                                            return;
                                        }
                                        fullfill(0);
                                    }).catch((err: any) => {
                                        throw err;
                                    });
                                });
                            });
                            listForRooms.push(p);
                        }
                    }

                    Promise.all(listForRooms).then((value: any) => {
                        let roomDataSet = that.contactWholeArray(value);
                        that.dataInMemory.set(id,roomDataSet);
                        fs.writeFileSync(__dirname + "/" + id + '.txt', JSON.stringify(roomDataSet), 'utf-8');
                        fullfill(true);

                    }).catch((err: any) => {
                        throw err;
                    });
                    // const listObBuilding = document["childNodes"][6]["childNodes"][3]["childNodes"][31]["childNodes"][10]["childNodes"][1]
                }).catch(function (err: any) {
                    throw err;
                });
            }).catch(function (err: any) {
                reject(false);
            });
        });
    }

    private findElementByAttri(element: ASTNode, attri: string): ASTNode {

        if (!element) {
            return null;
        }

        if (this.isContainAttri(element.attrs, attri)) {
            return element;
        } else {
            let child: ASTNode[] = element.childNodes;
            if (isUndefined(child) || child.length === 0) {
                return null;
            } else {
                for (let e of child) {
                    let rec = this.findElementByAttri(e, attri);
                    if (rec) {
                        return rec;
                    }
                }
            }
        }

        return null;
    }



    private findElementBynodeName(element: ASTNode, nn: string): ASTNode {

        if (!element) {
            return null;
        }

        if (element.nodeName === nn) {
            return element;
        } else {
            let child: ASTNode[] = element.childNodes;
            if (isUndefined(child) || child.length === 0) {
                return null;
            } else {
                for (let e of child) {
                    let rec = this.findElementBynodeName(e, nn);
                    if (rec) {
                        return rec;
                    }
                }
            }
        }
        return null;
    }

    private isContainAttri(attriArr: ASTAttribute[], attri: string): boolean {
        if (isUndefined(attriArr) || attriArr == []) {
            return false;
        } else {
            for (let e of attriArr) {
                if (e.value === attri) {
                    return true;
                }
            }
        }
        return false;
    }

    //Input: a set of data
    //function: check if the data is a valid room data
    //Output: return the room type if data is valid
    private setRoom(fullName: any, shortName: any, num: any, name: any, addr: any,
                    lat: any, lon: any, seats: any, type: any, furType: any, url: any): Room {

        if (typeof fullName === "string" && typeof shortName === "string" && typeof num === "string" &&
            typeof name === "string" && typeof addr === "string" && typeof lat === "number" &&
            typeof lon === "number" && typeof seats === "number" && typeof type === "string" &&
            typeof furType === "string" && typeof url === "string"){

            let r: Room = {
                rooms_fullname: fullName,
                rooms_shortname: shortName,
                rooms_number: num,
                rooms_name: name,
                rooms_address: addr,
                rooms_lat: lat,
                rooms_lon: lon,
                rooms_seats: seats,
                rooms_type: type,
                rooms_furniture: furType,
                rooms_href: url
            };
            return r;
        }
        return null;
    }

    //input: an array
    //function: append all arrays in this array
    //output: an array
    private contactWholeArray(arr:Array<any>):Array<any>{
        let result:Array<any> = [];
        for(let each of arr){
            if(Array.isArray(each)){
                result = result.concat(each);
            }
        }
        return result;
    }

    public getDataInMemory(): any {
        return this.dataInMemory;
    }

}
