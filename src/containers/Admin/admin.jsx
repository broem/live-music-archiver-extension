import React, { useState, useEffect } from 'react';
import EnhancedTable from "../Common/table";
import NestedList from "../Common/nestedList";
import CustomizedMenus from "../Common/menu";
import * as scrape from "../../pages/Background/scrape-fetch.js";

async function items(){
    var u = [];
    await scrape.adminGetUsers().then((users) => {
        console.log("users returned from adminGetUsers");
        u = users;
    }).catch((err) => {
        console.log(err);
    });

    return u;
}

const AdminPage = (props) => {
    const [users, setUsers] = useState([]);
    const [usersReturned, setUsersReturned] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const { isActive } = props;
    const setUserSelect = (user) => {
      setSelectedUser(user);
    }

    useEffect(() => {
      items().then((items) => {
        setUsersReturned(true);
        setUsers(items);
    }).catch((err) => {
        console.log(err);
    });
    }, []);

      if (isActive) {
        if (!usersReturned) {
            return (
                <div>
                    <div>Loading...</div>
                </div>
            )
        }

        return (
            <div>
                <CustomizedMenus items={users} selectOption={setUserSelect}/>
                {selectedUser.length > 0 && <EnhancedTable email={selectedUser} setEvent={props.setEvent}/>}
            </div>
        )
      } else {
        return null;
      }
}

export default AdminPage;