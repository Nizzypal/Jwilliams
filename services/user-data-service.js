'user strict'
angular.module('jwilliams')
    .service('UserDataService', function(){

        var UserInfo = {
            userID: '',
            userName: ''
        };

        return{
            getUserInfo: function(){
                return UserInfo;
            },
            setUserInfo: function(value){
                UserInfo = value;
            }
        };

    });