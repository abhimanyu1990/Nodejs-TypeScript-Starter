'use strict';

import * as permissionsData from "./conf/rolesAndPermissions/default.permissions.json";
import * as rolesData from "./conf/rolesAndPermissions/default.roles.json";
import Permission, { IPermission } from "./app/models/permission.model";
import Role, { IRole } from "./app/models/role.model";
import User, { Address, Gender } from "./app/models/user.model";

export default class Bootstrap {

    constructor() { 
        this.createPermissions();
    }

    public createAdmin() {
        User.findOne({ "role.roleValue": "ROLE_ADMIN" }).then((user) => {
            if (user == null) {
                Role.findOne({ "roleValue": "ROLE_ADMIN" }).then((role) => {
                    if (role != null) {
                        let addr = <Address>{
                            street: "test", city: "new", postCode: "110074"
                        };
                        User.create({ email: "abhimanyu1990@hotmail.com", firstName: "Abhimanyu", lastName: "Singh", gender: Gender.male, address: addr, role: role }).then((admin) => {
                        });
                    }
                });
            }
        });
    }


    public createRoles() {
        let roles = rolesData.roles;
        roles.forEach(role => {
            Role.findOne({ roleValue: role.roleValue }).then((roleVal) => {
                if (roleVal == null) {
                    Permission.find({ allowedRoles: [role.roleValue] }).then((permissionList) => {
                        let newRole: any = {
                            roleName: role.roleName,
                            roleValue: role.roleValue,
                            roleDescription: role.roleDescription,
                            permissions: permissionList
                        };

                        Role.create(newRole).then((createdRole) => {
                            if(createdRole.roleValue == "ROLE_ADMIN"){
                                this.createAdmin();
                            }
                        });
                    });
                }
            });
        });
    }

    
    public createPermissions() {

        let permissions = <any[]>permissionsData.permissions;
        Permission.findOne().then((permissionValue) => {
            if (permissionValue == null) {
                Permission.create(permissions).then((permissionList) => {
                        if(permissionList.length !== 0){
                            this.createRoles();
                        }
                });
            }
        });

    }
}