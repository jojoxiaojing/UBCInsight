import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
import DataController from "../src/controller/DataController";
var fs = require("fs");
var insightF: InsightFacade;

describe("data controller tests", function() {
    this.timeout(10000);
    var dataController: DataController;
    before(function () {
        // load the dataset for testing
        //let data  = fs.readFileSync(__dirname + '/data/courses.txt', 'utf-8');
        //fs.writeFileSync('./src/controller/courses.txt', data, 'utf-8')
        insightF = new InsightFacade();

        dataController = insightF.dataController;

    });

    after(function() {
        insightF.removeDataset('courses');
    })


    it("Test getDataset, file not inDisk", function () {
        let a = dataController.loadDataset('tears');
        expect(a).to.equal(null);
    });

    it("Test getDataset, file inDisk", async function () {
        let data = fs.readFileSync(__dirname + '/data/courses.zip', "base64");
        var coursePromise = await insightF.addDataset('courses', data);
        let a = dataController.loadDataset('courses');
        expect(a.length).to.equal(64612);
    });


    it("Test process, file inDisk", function () {
        dataController = new DataController();
        let data = fs.readFileSync(__dirname + '/data/courses.zip', "base64");
        return dataController.processCourses('courses', data).then((value: boolean)=> {
            expect(value).to.deep.equal(true)
        }).catch(()=>{
            expect.fail()})
    });

    it("Test process, file inDisk and file inMemory", function () {
        let data = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return dataController.processCourses('courses', data).then((value: boolean)=> {
            expect(value).to.deep.equal(true)
        }).catch(()=>{
            expect.fail()})
    });


    it("Test process, invalid content", function () {
        let data = "invalid content";
        return dataController.processCourses('courses', data).then((value: boolean)=> {
            expect.fail();
        }).catch((value: any)=>{
            expect(value).to.deep.equal(false)
        })
    });


})