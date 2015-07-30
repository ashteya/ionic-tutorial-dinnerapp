describe('LoginController', function() {

	var controller, 
		deferredLogin,
		dinnerServiceMock,
		stateMock,
		ionicPopupMock;

	// load the module for our app
	beforeEach(module('app'));
	
	// disable template caching
	beforeEach(module(function($provide, $urlRouterProvider) {
    	$provide.value('$ionicTemplateCache', function(){} );
	    $urlRouterProvider.deferIntercept();
	}));
	
	// instantiate the controller and mocks for every test
	beforeEach(inject(function($controller, $q) {
		deferredLogin = $q.defer();
		
		// mock dinnerService
		dinnerServiceMock = {
			login: jasmine.createSpy('login spy')
						  .and.returnValue(deferredLogin.promise)			
		};
		
		// mock $state
		stateMock = jasmine.createSpyObj('$state spy', ['go']);
		
		// mock $ionicPopup
		ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);
		
		// instantiate LoginController
		controller = $controller('LoginController', { 
						'$ionicPopup': ionicPopupMock, 
						'$state': stateMock, 
						'DinnerService': dinnerServiceMock }
					 );
	}));
	
	describe('#doLogin', function() {
		
		// call doLogin on the controller for every test
		beforeEach(inject(function(_$rootScope_) {
			$rootScope = _$rootScope_;
			controller.username = 'test1';
			controller.password = 'password1';
			controller.doLogin();
		}));
		
		it('should call login on dinnerService', function() {
			expect(dinnerServiceMock.login).toHaveBeenCalledWith('test1', 'password1');	
		});
		
	    describe('when the login is executed,', function() {
			it('if successful, should change state to my-dinners', function() {
				
				deferredLogin.resolve();
				$rootScope.$digest();
				
				expect(stateMock.go).toHaveBeenCalledWith('my-dinners');
			});
			
			it('if unsuccessful, should show a popup', function() {
				
				deferredLogin.reject();
				$rootScope.$digest();
				
				expect(ionicPopupMock.alert).toHaveBeenCalled();
			});
		});
	})
});