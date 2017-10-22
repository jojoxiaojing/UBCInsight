import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
import DataController from "../src/controller/DataController";
var fs = require("fs");
var insightF: InsightFacade;

describe("testAddData", function() {
    this.timeout(10000);
    var dataController: DataController;
    beforeEach(function () {
        // load the dataset for testing
        let data  = fs.readFileSync(__dirname + '/data/courses.txt', 'utf-8');
        fs.writeFileSync('./src/controller/courses.txt', data, 'utf-8')
        insightF = new InsightFacade();
        insightF.addDataset('courses', data);
        dataController = insightF.dataController;

    });

    after(function() {
        insightF.removeDataset('courses');
    })


    it("Test getDataset, file not inDisk", function () {
        let a = dataController.getDataset('tears');
        expect(a).to.equal(null);
    });

    it("Test getDataset, file inDisk", function () {
        let a = dataController.getDataset('courses');
        expect(a.length).to.equal(64612);
    });


    it("Test process, file inDisk", function () {
        dataController = new DataController();
        let data = fs.readFileSync(__dirname + '/data/courses.zip', "base64");
        return dataController.processCourses('courses', data).then((value: InsightResponse)=> {
            expect(value.code).to.deep.equal(204)
            let firstKey = Object.keys(value.body)[0];
            expect(firstKey).to.deep.equal("dataStore")
            let firstElement = value.body[firstKey]
            expect(value.body[firstKey].length).to.deep.equal(64612);
        }).catch(()=>{
            expect.fail()})
    });

    it("Test process, file inDisk and file inMemory", function () {
        let data = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return dataController.processCourses('courses', data).then((value: InsightResponse)=> {
                expect(value.code).to.deep.equal(201)
                let firstKey = Object.keys(value.body)[0];
                expect(firstKey).to.deep.equal("dataStore")
                let firstElement = value.body[firstKey]
                expect(value.body[firstKey].length).to.deep.equal(64612);
            }).catch(()=>{
            expect.fail()})
    });


    it("Test process, invalid content", function () {
        let data = "invalid content";
        return dataController.processCourses('courses', data).then((value: InsightResponse)=> {
            expect.fail();
        }).catch((value: any)=>{
            expect(value.code).to.deep.equal(400)
            let firstKey = Object.keys(value.body)[0];
            expect(firstKey).to.deep.equal("error")
            let firstElement = value.body[firstKey]
            expect(value.body[firstKey]).to.deep.equal("Invalid base64 input, bad content length.");
        })
    });


})