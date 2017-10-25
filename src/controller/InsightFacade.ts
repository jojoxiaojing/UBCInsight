/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";
import Log from "../Util";
import QueryController from "./QueryController/QueryController";
import {isUndefined} from "util";
import DataController from "./DataController";
var fs = require("fs");


export default class InsightFacade implements IInsightFacade {
    //dataInMemory:Map<string,any[]>;
    dataController: DataController = new DataController();


    constructor() {
        //Log.trace('InsightFacadeImpl::init()');
        //this.dataInMemory= new Map<string,any[]>();
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        let that = this;
        var dataController = that.dataController;
        return new Promise((fulfill, reject)=> {
            try {
                var c: number;
                if (dataController.loadDataset(id) == null || dataController.loadDataset(id) == {}){
                    c = 204;
                } else {
                    c = 201;
                }
                if (id === "courses") {
                    dataController.processCourses(id, content).then((value: boolean)=>{
                        if (value === true) {
                            fulfill({code: c, body: {}});
                        } else {
                            throw new Error("Dataset is invalid")
                            //reject({code: 400, error: "dataset invalid"})
                        }
                    }).catch(function (err: Error) {
                        reject({code: 400, error: err});
                    });
                } else if (id === "rooms") {
                    dataController.processRooms(id, content).then(()=>{
                        fulfill({code: c, body: {}});
                    }).catch(function (err: Error) {
                        reject({code: 400, error: 'error'});
                    });
                } else {
                    reject({code: 400, error: 'ID is invalid'});
                }
            } catch (err) {
                reject({code:400, error: err});
            }
        });
    }


    removeDataset(id: string): Promise<InsightResponse> {
        let that = this;

        return new Promise<InsightResponse>((fulfill, reject) =>{
            try{
                let ifFileExist = fs.existsSync(__dirname + "/" + id + '.txt');
                var s: InsightResponse = {
                    code: 204,
                    body: {}
                };

                if((!ifFileExist && !(this.dataController.dataInMemory.has(id))) || (id !== 'courses' && id !== 'rooms')){
                    s.code = 404;
                    s.body = {error: "dataset not in memory"}
                    reject(s);
                }

                if(ifFileExist){
                    fs.unlink(__dirname + "/" + id + '.txt');
                }

                if(this.dataController.dataInMemory.has(id)){
                    this.dataController.dataInMemory.delete(id);
                }
                fulfill(s);

            }catch(err){
                s.code = 404;
                s.body = {error: "something went wrong"}
                reject(s);
            }
        });
    }

    performQuery(query: any): Promise <InsightResponse> {

        var s: InsightResponse = {code: null, body: {}};
        var queryController = new QueryController(query, []);
        var isValid = queryController.isValid();
        var id = queryController.guessID();

        let that = this;
        var dataController = that.getDataController();
        // var dataMap = dataController.getDataInMemory();

        return new Promise<InsightResponse>((fulfill, reject) =>{
            //initialize response variable
            var s: InsightResponse = {code: null, body: {}};

            if (id === "wrongID") {
                s.code = 400;
                s.body = {error: "query invalid"};
                reject(s);
                return;
            }

            try {
                if (isValid) {
                    if (dataController.loadDataset(id) === null) {
                        s.code = 424;
                        s.body = {error: "missing dataset"}
                        reject(s);

                    } else {
                        let tempData = dataController.loadDataset(id);
                        s.code = 200;
                        var output: any = {result: []}
                        output.result = this.processData(tempData, queryController)
                        s.body = output;
                        fulfill(s);
                    }
                } else {
                    s.code = 400;
                    s.body = {error: "query invalid"};
                    reject(s);
                }
            } catch(err){
                s.code = 400;
                s.body = {error: err};
                reject(s);
            }

        });
    }

    getDataController(): DataController {
        return this.dataController;
    }



    processData(tempData: any[], qController: QueryController): any[] {
        let res: any[] = [];
        let val: any;
        for (val of tempData) {
            qController.setData(val);
            if (qController.getQueryBody().applyFilter()) res.push(val);
        }
        qController.getQueryBody().getQueryOpt().setOptionsData(res)
        return qController.getQueryBody().getQueryOpt().applyOptions();
    }
}
