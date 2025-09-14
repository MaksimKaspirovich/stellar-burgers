describe('Интеграционные тесты на Cypress написаны для страницы конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Тест добавления ингредиента/булки в конструктор', () => {
    cy.contains('Оформить заказ').should('exist');

    //Добавляем булку
    cy.contains('Выберите булки').should('exist'); //Проверяем наличие булки
    cy.contains('Флюоресцентная булка R2-D3') //Добавляем булку
      .closest('li')
      .within(() => cy.contains('Добавить').click());
    cy.contains('Оформить заказ') //Проверяем, что добавлена нужная булка
      .parent()
      .parent()
      .within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
      });

    //Добавляем начинку
    cy.contains('Выберите начинку').should('exist'); //Проверяем наличие начинки
    cy.contains('Мясо бессмертных моллюсков Protostomia') //Добавляем начинку
      .closest('li')
      .within(() => cy.contains('Добавить').click());
    cy.contains('Оформить заказ') //Проверяем, что добавлена нужная начинка
      .parent()
      .parent()
      .within(() => {
        cy.contains('Мясо бессмертных моллюсков Protostomia').should('exist');
      });

    //Проверяем, что добавлена нужна булка и начинка в конструктор
    cy.contains('Оформить заказ')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
        cy.contains('Мясо бессмертных моллюсков Protostomia').should('exist');
      });
    //Проверяем, что кнопка заказа стала доступна
    cy.contains('Оформить заказ').should('be.visible').and('not.be.disabled');
  });

  it('Тест модальных окон: открытие модального окна ингредиента и закрытие по клику на оверлей', () => {
    //Открываем модальное окно ингредиента
    cy.contains('Детали ингредиента').should('not.exist'); //Проверяем, открыто ли модальное окно
    cy.contains('Флюоресцентная булка R2-D3').click(); //Выбираем ингредиент
    cy.contains('Детали ингредиента').should('exist'); //Проверяем, открылось ли модальное окно
    cy.get('#modals').within(() => {
      //Проверяем нужное ли окно открылось
      cy.contains('Флюоресцентная булка R2-D3').should('be.visible');
    });

    //Закрываем модальное окно по клику на оверлей
    cy.get('body').click(0, 0); //Нажимаем вне области модального окна
    cy.contains('Детали ингридиента').should('not.exist'); //Проверяем, что модальное окно закрылось
  });

  it('Тест закрытия модального окна по клику на кнопку закрытия', () => {
    //Открываем модальное окно ингредиента
    cy.contains('Детали ингредиента').should('not.exist'); //Проверяем, открыто ли модальное окно
    cy.contains('Флюоресцентная булка R2-D3').click(); //Выбираем ингредиент
    cy.contains('Детали ингредиента').should('exist'); //Проверяем, открылось ли модальное окно
    cy.get('#modals').within(() => {
      //Проверяем нужное ли окно открылось
      cy.contains('Флюоресцентная булка R2-D3').should('be.visible');
    });

    //Закрываем модальное окно по клику на кнопку закрытия
    cy.get('#modals').find('button').click(); //Нажимаем на кнопку закрытия
    cy.contains('Детали ингридиента').should('not.exist'); //Проверяем, что модальное окно закрылось
  });

  it('Создание заказа', () => {
    cy.setCookie('accessToken', 'test-access'); //Создаем токены авторизации для теста
    window.localStorage.setItem('refreshToken', 'test-refresh');

    cy.intercept('GET', 'api/auth/user', {
      //Мокаем профиль пользователя
      statusCode: 200,
      fixture: 'user.json'
    }).as('getUser');

    cy.visit('/'); //Перезагрузка, чтобы сработала верификация
    cy.wait(['@getIngredients', '@getUser']);

    cy.intercept('POST', 'api/orders', {
      //Мокаем создание заказа
      statusCode: 200,
      fixture: 'order.json'
    }).as('postOrder');

    //Собираем бургер
    //Проверяем начальное состояние конструктора
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
    cy.contains('Оформить заказ').should('exist');

    //Добавляем булку
    cy.contains('Выберите булки').should('exist'); //Проверяем наличие булки
    cy.contains('Флюоресцентная булка R2-D3') //Добавляем булку
      .closest('li')
      .within(() => cy.contains('Добавить').click());
    cy.contains('Оформить заказ') //Проверяем, что добавлена нужная булка
      .parent()
      .parent()
      .within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
      });

    //Добавляем начинку
    cy.contains('Выберите начинку').should('exist'); // Проверяем наличие начинки
    cy.contains('Мясо бессмертных моллюсков Protostomia') //Добавляем начинку
      .closest('li')
      .within(() => cy.contains('Добавить').click());
    cy.contains('Оформить заказ') //Проверяем, что добавлена нужная начинка
      .parent()
      .parent()
      .within(() => {
        cy.contains('Мясо бессмертных моллюсков Protostomia').should('exist');
      });

    //Проверяем, что добавлена нужна булка и начинка в конструктор
    cy.contains('Оформить заказ')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
        cy.contains('Мясо бессмертных моллюсков Protostomia').should('exist');
      });

    //Проверяем, что кнопка заказа стала доступна
    cy.contains('Оформить заказ').should('be.visible').and('not.be.disabled');

    //Оформляем заказ
    cy.contains('идентификатор заказа').should('not.exist');//Проверяем что модальное окно заказа отсутствует
    cy.contains('Оформить заказ').click();
    cy.wait('@postOrder');//Оформляем заказ
    cy.get('#modals').within(() => {//Проверяем что открылось модальное окно и номер заказа верный
      cy.contains('идентификатор заказа').prev().should('have.text', '12345');
    });

    //Закрываем модальное окна заказа
    cy.get('body').type('{esc}');//Закрываем модальное окно через Escape
    cy.contains('идентификатор заказа').should('not.exist');//Проверяем, что модальное окно закрылось

    //Проверяем очистку конструктора после оформления заказа
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');

    //Очищаем моковые данные после завершения теста
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
