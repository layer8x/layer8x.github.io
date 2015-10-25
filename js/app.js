var app = angular.module('codeLab', []);

app.controller('RepoController', function ($scope, $http) {
  $scope.loaded = false;

  $scope.die = function (message) {
    alert(message);
  }

  $http({
    method: 'GET',
    url: 'https://api.github.com/orgs/layer8x/repos'
  })
    .then(function successCallback(response) {
      $scope.repos = response.data;
      addPagesUrlToRepos();
      $scope.loaded = true;
    }, function errorCallback(response) {
      die(response);
    });

  function addPagesUrlToRepos() {
    $scope.repos.forEach(function (repo, index, repos) {
      if (repo.name.indexOf('github.io') == -1) {
        $http.get('https://raw.githubusercontent.com/layer8x/' + repo.name + '/master/CNAME')
          .then(function successCallback(response) {
            repo.pages_url = 'http://' + response.data;
          }, function errorCallback(response) {
            $http.get('https://raw.githubusercontent.com/layer8x/' + repo.name + '/gh-pages/CNAME')
              .then(function successCallback(response) {
                repo.pages_url = 'http://' + response.data;
              }, function errorCallback(response) {
                repo.pages_url = "https://layer8x.github.io/" + repo.name;
              });
            });
      } else {
        repo.pages_url = 'http://' + repo.name;
      };
    });
  };
});
