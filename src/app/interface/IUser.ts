export interface IuserLogin {
    dataUser: DataUser;
    token:    string;
}

export interface DataUser {
    id:           number;
    user:         string;
    email:        string;
    typeusers_id: number;
}
