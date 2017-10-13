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
        insightF.getValue().id = null;
        insightF.getValue().data = [];

    });

    after(function () {
        //Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        //Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

//Not in memory




    it("Test performQuery, just IS with no *, it should return 200 and xx length of data ", function () {
        var testQuery = {"WHERE": {AND: [{NOT: {"IS": {"courses_dept": "math"}}}, {NOT: {"IS": {"courses_instructor": "ma"}}},
            {NOT: {"IS": {"courses_instructor": "po"}}}, {NOT: {"IS": {"courses_dept": "p*"}}}]}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.length;
           // expect(m).to.equal(2772);
            let n =Object.keys(value.body[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });
    });

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

    it("Test performQuery, just IS with no *, it should return 200 and xx length of data ", function () {
        var testQuery ={"WHERE": {"IS": {"courses_dept": "math"}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.length;
            expect(m).to.equal(2772);
            let n =Object.keys(value.body[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just IS with one * at the beginning, it should return 200 and xx length of data ", function () {
        var testQuery ={"WHERE": {"IS": {"courses_dept": "*ps"}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.length;
            expect(m).to.equal(806);
            let n =Object.keys(value.body[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });
    });


    it("Test performQuery, just IS with one * at the end, it should return 200 and xx length of data ", function () {
        var testQuery ={"WHERE": {"IS": {"courses_dept": "cp*"}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.length;
            expect(m).to.equal(1155);
            let n =Object.keys(value.body[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just IS with two * at the beginning and in the end, it should return 200 and xx length of data ", function () {
        var testQuery ={"WHERE": {"IS": {"courses_dept": "*ps*"}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.length;
            expect(m).to.equal(5073);
            let n =Object.keys(value.body[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just EQ, it should return 200 and 107 length of data ", function () {
        var testQuery ={"WHERE": {"EQ": {"courses_pass": 100}}, "OPTIONS": {"COLUMNS": ["courses_dept",  "courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.length;
            expect(m).to.equal(107);
            let n =Object.keys(value.body[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just GT, it should return 200 and 9091 length of data ", function () {
        var testQuery ={"WHERE": {"GT": {"courses_pass": 99}}, "OPTIONS": {"COLUMNS": ["courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.length;
            expect(m).to.equal(9091);
            let n =Object.keys(value.body[0]).length;
            expect(n).to.equal(2);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just LT, it should return 200 and 439 length of data ", function () {
        var testQuery ={"WHERE": {"LT": {"courses_pass": 3}}, "OPTIONS": {"COLUMNS": ["courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.length;
            expect(m).to.equal(439);
            let n =Object.keys(value.body[0]).length;
            expect(n).to.equal(2);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just AND, it should return 200 and 439 length of data ", function () {
        var testQuery ={"WHERE": {"AND":[{"LT": {"courses_pass": 10}},{"GT": {"courses_avg": 90}}]}, "OPTIONS": {"COLUMNS": ["courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.length;
            expect(m).to.equal(1034);
            let n =Object.keys(value.body[0]).length;
            expect(n).to.equal(2);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, just OR, it should return 200 and 439 length of data ", function () {
        var testQuery ={"WHERE": {"OR":[{"LT": {"courses_pass": 3}},{"GT": {"courses_avg": 99}}]}, "OPTIONS": {"COLUMNS": ["courses_instructor","courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.length;
            expect(m).to.equal(442);
            let n =Object.keys(value.body[0]).length;
            expect(n).to.equal(2);
        }).catch(function(err:any){
            expect.fail();
        });
    });




    it("Test performQuery, real query, it should return 200 and 162 length of data ", function () {
        var testQuery = {"WHERE":{"AND": [{"GT": {"courses_audit": 2}}, {"OR": [{"GT": {"courses_fail": 10}}, {"GT": {"courses_pass": 100}}]}]}, "OPTIONS": {"COLUMNS": ["courses_dept", "courses_avg"], "ORDER": "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect(value.code).to.equal(200);
            let m = value.body.length;
            expect(m).to.equal(162);
            let n =Object.keys(value.body[1]).length;
            expect(n).to.equal(2);
        }).catch(function(err:any){
            expect.fail();
        });
    });

    it("Test performQuery, real query and the data lenght should be 1 ", function () {
        var testQuery = {
            "WHERE":{
                "AND":[
                    {
                        "AND":[
                            {
                                "GT":{
                                    "courses_avg":90
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":"adhe"
                                }
                            }
                        ]
                    },
                    {
                        "GT":{
                            "courses_avg":95
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg"
            }
        };
        return insightF.performQuery(testQuery).then(function(value:any){
            let a = value;
            expect(value.code).to.equal(200);
            let m = value.body.length;
            expect(m).to.equal(1);
            let n =Object.keys(value.body[0]).length;
            expect(n).to.equal(3);
        }).catch(function(err:any){
            expect.fail();
        });

    });



    //Test if there is no such dataset

    it("If file does not exit, it should return 424 ", function () {
        insightF.getValue().id = null;
        insightF.getValue().data = [];

        if(fs.existsSync('./src/controller/data.txt')){
            fs.unlinkSync('./src/controller/data.txt');
        }
        var testQuery = {WHERE: {AND: [{GT: {courses_audit: 2}}, {OR: [{GT: {courses_fail: 10}}, {GT: {courses_pass: 100}}]}]}, OPTIONS: {COLUMNS: ["courses_dept", "courses_avg"], ORDER: "courses_avg"}}
        return insightF.performQuery(testQuery).then(function(value:any){
            expect.fail();

        }).catch(function(err:any){
            let a = err;
            expect(a.code).to.equal(424);
        });

    });



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