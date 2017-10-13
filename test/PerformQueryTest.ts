import {expect} from 'chai';
import Log from "../src/Util";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";
var fs = require("fs");


describe("testPerformQuery", function() {
    this.timeout(1000000);
    var insightF: InsightFacade;
    before(function () {
        //Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        //Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insightF = new InsightFacade();

    });

    after(function () {
        //Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        //Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

//Not in memory

    it("Import course.zip and store the data, it should return code 204", function () {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

           return insightF.addDataset("Courses", data).then(function (value: any) {
                let a = value;
                expect(a.code).to.deep.equal(204);
            }).catch(function (err) {
                expect.fail();
            });
    });




    it("Test performQuery, invalid query returning 400 code: WHERE is misspelled", function () {

            //insightF.addDataset("Courses",data);
            var testQuery = {THERE: {AND: [{GT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            return insightF.performQuery(testQuery).then(function(value:any){
                let m = value;
               expect.fail();

            }).catch(function(err:any){
                let a = err;
                expect(a.code).to.equal(400);
            });

    });

    it("Test performQuery, invalid query returning 400 code: GT has string input", function () {

            //insightF.addDataset("Courses",data);
            var testQuery = {WHERE: {AND: [{NOT: {GT: {courses_audit: 2}}}, {AND: [{GT: {courses_fail: "a"}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            return insightF.performQuery(testQuery).then(function(value:any){
                let a =value;
                expect.fail();

            }).catch(function(err:any){
                let a = err;
                expect(a.code).to.equal(400);
            });
    });


    it("Test performQuery, real query ", function () {
            var testQuery = {WHERE: {AND: [{GT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            return insightF.performQuery(testQuery).then(function(value:any){
                let a = value;
                expect(value.code).to.equal(200);

            }).catch(function(err:any){
                expect.fail();
            });

    });

   /* it("If file does not exit, it should return 424 ", function () {
        insightF.getValue().id = null;
        insightF.getValue().data = [];

        if(fs.existsSync('./src/controller/data.txt')){
            fs.unlink('./src/controller/data.txt');
        }
        var testQuery = {WHERE: {AND: [{GT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect.fail();

        }).catch(function(err:any){
            let a = err;
            expect(a.code).to.equal(424);
        });

    });
*/
    //Already in memory


    it("Already in memory:Test performQuery, invalid query returning 400 code: WHERE is misspelled", function () {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return insightF.addDataset("Courses", data).then(function (value: any) {
            var testQuery = {THERE: {AND: [{GT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            return insightF.performQuery(testQuery).then(function(value:any){
                let m = value;
                expect.fail();

            }).catch(function(err:any){
                let a = err;
                expect(a.code).to.equal(400);
            });
        }).catch(function (err) {
            expect.fail();
        });

        //insightF.addDataset("Courses",data);


    });

    it("Already in memory:Test performQuery, invalid query returning 400 code: GT has string input", function () {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return insightF.addDataset("Courses", data).then(function (value: any) {
            var testQuery = {WHERE: {AND: [{NOT: {GT: {courses_audit: 2}}}, {AND: [{GT: {courses_fail: "a"}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            return insightF.performQuery(testQuery).then(function(value:any){
                let a =value;
                expect.fail();

            }).catch(function(err:any){
                let a = err;
                expect(a.code).to.equal(400);
            });
        }).catch(function (err) {
            expect.fail();
        });
        //insightF.addDataset("Courses",data);

    });


    it("Already in memory:Test performQuery, real query ", function () {
        let data  = fs.readFileSync(__dirname + '/data/courses.zip', "base64");

        return insightF.addDataset("Courses", data).then(function (value: any) {
            var testQuery = {WHERE: {AND: [{GT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
            return insightF.performQuery(testQuery).then(function(value:any){
                let a = value;
                expect(value.code).to.equal(200);

            }).catch(function(err:any){
                expect.fail();
            });
        }).catch(function (err) {
            expect.fail();
        });


    });


})