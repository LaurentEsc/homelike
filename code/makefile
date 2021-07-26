test:
	./node_modules/.bin/jest .
	
clean:
	rm -rf dist

build:
	./node_modules/.bin/webpack --mode production

package:
	bash scripts/package.sh

prepare: clean build package

deploy: deploy/signUp deploy/signIn deploy/createProperty deploy/markPropertyAsFavorite deploy/searchProperties deploy/listMyFavorites

deploy/signUp:
	aws lambda update-function-code \
				--function-name homelike_sign_up \
				--zip-file fileb://dist/functions/signUp.zip \
				--profile laurent

deploy/signIn:
	aws lambda update-function-code \
				--function-name homelike_sign_in \
				--zip-file fileb://dist/functions/signIn.zip \
				--profile laurent

deploy/createProperty:
	aws lambda update-function-code \
				--function-name homelike_create_property \
				--zip-file fileb://dist/functions/createProperty.zip \
				--profile laurent

deploy/markPropertyAsFavorite:
	aws lambda update-function-code \
				--function-name homelike_mark_property_as_favorite \
				--zip-file fileb://dist/functions/markPropertyAsFavorite.zip \
				--profile laurent

deploy/searchProperties:
	aws lambda update-function-code \
				--function-name homelike_search_properties \
				--zip-file fileb://dist/functions/searchProperties.zip \
				--profile laurent

deploy/listMyFavorites:
	aws lambda update-function-code \
				--function-name homelike_list_my_favorites \
				--zip-file fileb://dist/functions/listMyFavorites.zip \
				--profile laurent
