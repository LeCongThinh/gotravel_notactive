import {Global, HttpStatus, Injectable} from '@nestjs/common';
import {Response} from "express";
import * as _ from "lodash";

@Injectable()
export class RestApi {
    notFound = (res: Response, message: string) => {
        res.status(404).json({status: 404, message: message});
    }

    turnOffStatus = (res: Response, message: string) => {
        res.status(401).json({status: 402, message: message});
    }


    forbidden = (res, message) => {
        res.status(403).json({status: 403, message: message});
    }

    /**
     * Response res
     * @param Response res
     * @param data
     * @param keyAdditional
     */

    success = (res: Response, data: any, keyAdditional = null) => {
        if (_.isEmpty(data)) {
            res.status(HttpStatus.OK).json({status: HttpStatus.OK, message: 'OK'});
        } else {
            let response = {status: HttpStatus.OK, message: 'OK', data: data};
            if (keyAdditional != null) {
                response = Object.assign({}, response, keyAdditional);
            }
            res.status(HttpStatus.OK).json(response);
        }
    }

    error = (res: Response, data: any, keyAdditional = null) => {
        if (_.isEmpty(data)) {
            res.status(HttpStatus.OK).json({status: HttpStatus.BAD_REQUEST, message: 'OK'});
        } else {
            let response = {status: HttpStatus.BAD_REQUEST, message: 'OK', data: data};
            if (keyAdditional != null) {
                response = Object.assign({}, response, keyAdditional);
            }
            res.status(HttpStatus.BAD_REQUEST).json(response);
        }
    }

}
