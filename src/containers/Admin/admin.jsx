import React, { useState, useEffect } from 'react';

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
        console.log(items);
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
                {selectedUser.length > 0 && <EnhancedTable email={selectedUser}/>}
            </div>
        )
      } else {
        return null;
      }
}

export default AdminPage;