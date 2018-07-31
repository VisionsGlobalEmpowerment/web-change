node {
    checkout scm

    stage('Prepare') {
        sh 'cp -rf $HOME/build-cache/vendor ./'
        sh 'cp -rf $HOME/build-cache/node_modules ./'
    }

    docker.image('postgres:10.4').withRun('-e "POSTGRES_PASSWORD=postgres" -e "POSTGRES_DB=webchange"') { c ->
        stage('Build') {
            docker.image('composer').inside('-v $HOME/build-cache/composer:/tmp') {
                sh 'cp .env.jenkins .env'
                sh 'composer install'
            }
        }
        stage('Test') {
            def appImage = docker.build("app-image")
            appImage.inside("--link ${c.id}:postgres") {
                sh 'php artisan migrate:fresh'
                sh 'php ./vendor/bin/phpunit'
            }
            docker.image('node:10').inside('-e "HOME=."') {
                sh 'npm install'
                sh 'npm run test'
            }
        }
    }

    stage('Cache results') {
        sh 'cp -rf ./vendor $HOME/build-cache/'
        sh 'cp -rf ./node_modules $HOME/build-cache/'
    }

    if (env.BRANCH_NAME == 'master') {
        stage('Deploy') {
            sh 'composer install --no-dev --no-interaction'
            sh 'npm run prod'

            sh "mkdir /srv/www/web-change/releases/${currentBuild.id}"
            sh "rsync -vzrS --exclude=\".*\" --exclude=\"node_modules\" --exclude=\"storage\" --exclude=\"bootstrap/cache\" ./ /srv/www/web-change/releases/${currentBuild.id}/"
            sh "ln -s /srv/www/web-change/shared/.env /srv/www/web-change/releases/${currentBuild.id}/.env"
            sh "ln -s /srv/www/web-change/shared/storage /srv/www/web-change/releases/${currentBuild.id}/storage"
            sh "ln -s /srv/www/web-change/shared/bootstrap/cache /srv/www/web-change/releases/${currentBuild.id}/bootstrap/cache"
            sh "ln -nsf /srv/www/web-change/releases/${currentBuild.id} /srv/www/web-change/current"
            sh 'sudo service php7.2-fpm reload'
        }
    }
}