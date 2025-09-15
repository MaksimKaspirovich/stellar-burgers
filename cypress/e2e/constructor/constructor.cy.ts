describe('Интеграционные тесты на Cypress написаны для страницы конструктора бургера', () => {
  const INGREDIENT_IDS = {
    FLUORESCENT_BUN: 'bun-1',
    MOLLUSC_MEAT: 'main-1',
    GALACTIC_SAUCE: 'souce-1'
  };

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
    cy.get('[data-cy="order-button"]').should('exist');

    //Проверяем начальное состояние
    cy.get('[data-cy="no-buns-top"]').should('exist');
    cy.get('[data-cy="no-filling"]').should('exist');

    // Добавляем булку
    cy.get(`[data-cy="ingredient-${INGREDIENT_IDS.FLUORESCENT_BUN}"]`)
      .contains('button', 'Добавить')
      .click();

    // Проверяем, что булка добавлена в конструктор
    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');

    // Добавляем начинку
    cy.get(`[data-cy="ingredient-${INGREDIENT_IDS.MOLLUSC_MEAT}"]`)
      .contains('button', 'Добавить')
      .click();
    // Проверяем, что начинка добавлена
    cy.get(`[data-cy="ingredient-${INGREDIENT_IDS.MOLLUSC_MEAT}"]`).should(
      'exist'
    );
    cy.get('[data-cy="no-filling"]').should('not.exist');
    // Проверяем, что кнопка заказа стала доступна
    cy.get('[data-cy="order-button"]')
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('Тест модальных окон: открытие модального окна ингредиента и закрытие по клику на оверлей', () => {
    //Открываем модальное окно ингредиента
    cy.get('[data-cy="modal-overlay"]').should('not.exist'); //Проверяем, открыто ли модальное окно
    cy.get(`[data-cy="ingredient-${INGREDIENT_IDS.FLUORESCENT_BUN}"]`).click(); //Выбираем ингредиент
    cy.get('[data-cy="ingredient-details-modal"]').should('exist'); //Проверяем, открылось ли модальное окно
    cy.get('[data-cy="ingredient-details-modal"]').within(() => {
      // Проверяем нужное ли окно открылось
      cy.contains('Флюоресцентная булка R2-D3').should('be.visible');
    });

    // Закрываем модальное окно по клику на оверлей
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="ingredient-details-modal"]').should('not.exist');
  });

  it('Тест закрытия модального окна по клику на кнопку закрытия', () => {
    //Открываем модальное окно ингредиента
    cy.get('[data-cy="modal-overlay"]').should('not.exist'); //Проверяем, открыто ли модальное окно
    cy.get(`[data-cy="ingredient-${INGREDIENT_IDS.FLUORESCENT_BUN}"]`).click(); //Выбираем ингредиент
    cy.get('[data-cy="ingredient-details-modal"]').should('exist'); //Проверяем, открылось ли модальное окно
    cy.get('[data-cy="ingredient-details-modal"]').within(() => {
      // Проверяем нужное ли окно открылось
      cy.contains('Флюоресцентная булка R2-D3').should('be.visible');
    });

    //Закрываем модальное окно по клику на кнопку закрытия
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="ingredient-details-modal"]').should('not.exist');
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
    cy.get('[data-cy="order-button"]').should('exist');

    //Проверяем начальное состояние
    cy.get('[data-cy="no-buns-top"]').should('exist');
    cy.get('[data-cy="no-filling"]').should('exist');

    // Добавляем булку
    cy.get(`[data-cy="ingredient-${INGREDIENT_IDS.FLUORESCENT_BUN}"]`)
      .contains('button', 'Добавить')
      .click();

    // Проверяем, что булка добавлена в конструктор
    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');

    // Добавляем начинку
    cy.get(`[data-cy="ingredient-${INGREDIENT_IDS.MOLLUSC_MEAT}"]`)
      .contains('button', 'Добавить')
      .click();
    // Проверяем, что начинка добавлена
    cy.get(`[data-cy="ingredient-${INGREDIENT_IDS.MOLLUSC_MEAT}"]`).should(
      'exist'
    );
    cy.get('[data-cy="no-filling"]').should('not.exist');
    // Проверяем, что кнопка заказа стала доступна
    cy.get('[data-cy="order-button"]')
      .should('be.visible')
      .and('not.be.disabled');

    //Оформляем заказ
    cy.get('[data-cy="modal-overlay"]').should('not.exist'); //Проверяем что модальное окно заказа отсутствует
    cy.get('[data-cy="order-button"]').click();
    cy.wait('@postOrder'); //Оформляем заказ

    // Проверяем модальное окно заказа
    cy.get('[data-cy="modal-overlay"]').should('exist');
    cy.get('[data-cy="order-number"]').should('have.text', '12345');
    cy.get('[data-cy="order-identifier-text"]').should(
      'contain',
      'идентификатор заказа'
    );

    //Закрываем модальное окна заказа
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="order-modal"]').should('not.exist');
    
    //Проверяем очистку конструктора после оформления заказа
    cy.get('[data-cy="no-buns-top"]').should('exist');
    cy.get('[data-cy="no-filling"]').should('exist');

    //Очищаем моковые данные после завершения теста
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
