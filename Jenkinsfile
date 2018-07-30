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
}