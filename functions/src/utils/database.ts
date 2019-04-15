import * as admin from "firebase-admin";
import Reference = admin.database.Reference;
import Database = admin.database.Database;

class DatabaseInterface {

    database: Database;
    reference: Reference;
    admin_firebase: any;
    base_path: string;

    constructor(admin_firebase: any, base_path: string) {
        this.database = admin_firebase.database();
        this.reference = this.database.ref(`/${base_path}`);
        this.admin_firebase = admin_firebase;
        this.base_path = base_path;
    }

    async getAll(callback: Function) {
        const data: any[] = [];

        await this.reference.once("value", function (snapshot: any) {
            const tmp = snapshot.val();
            for (const k in tmp) {
                if (tmp.hasOwnProperty(k)) {
                    data.push({
                        id: k,
                        data: tmp[k]
                    });
                }
            }
            callback(data);
        });
    };

    async read() {

        let result: any = null;

        await this.reference
            .once("value")
            .then((snapshot: any) => {
                result = snapshot.val();
            }).catch((e) => {
                console.error(e);
            });

        return result;
    };

    async getOne(id: string) {

        let result: any = null;

        await this.reference.child('/' + id)
            .once("value")
            .then((data: any) => {
                if (data.val()) {
                    result = {
                        id: data.key,
                        data: data.val()
                    };
                }
            });
        return result;
    };

    async create(data: any) {
        const ref = await this.reference.push(data);
        return {
            id: ref.key,
            data
        };
    }

    async update(id: string, data: any, callback: Function) {
        await this.reference.child(id).update(data);
        callback({
            id: id,
            data
        });
    }

    async updateNoId(data: any, callback?: Function) {
        await this.reference.set(data).catch((reason: any) => {
            console.log(reason);
        });
        if (callback) {
            callback({
                data
            });
        }
    }

    async delete(id: string) {
        await this.reference.child(id).remove();
    }

    setParent(parent: string) {
        return new DatabaseInterface(this.admin_firebase, `${parent}/${this.base_path}`);
    }

    setReference(newReference: string) {
        this.reference = this.database.ref(newReference);
        return this;
    }
}

export {DatabaseInterface};
