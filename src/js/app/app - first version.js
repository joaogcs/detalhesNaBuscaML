/*
gerenciar erro de timeout status: 500
*/

/*
Mostrar nickname ?
*/

/*
Mostrar o que quando não tem reputação ?
*/

/*
Mostrar qtd de canceladas e completadas ?
*/

/*
Mostrar qtd de negativos, neutros e positivos ? Nivel de satisfação !
*/

/*
Reputação pula linha quando o valor do produto é acima de 4 digitos com 2 decimais
*/

/*
Cannot read date of undefined ?
Quando o item tem o frete a combinar!
*/

/*
Colocar a previsão do frete grátis do lado do texto do frete grátis
Não precisa criar um elemento, só alterar o texto do elemento já existente adicionando
o texto dos dias do frete
Bem facil
*/

/*
Criar elemento que sobrepoe o proximo ou anterior.
Colocar o campo da reputação quando em grade em cima do valor sobrepondo a imagem.
*/

/*
Colocar a reputação do vendedor na tela do produto!
Pra pegar o "seller_id"
https://api.mercadolibre.com/items/MLB1139878353/
Pra pegar a reputação do vendedor
https://api.mercadolibre.com/users/138235844
	"nickname": "MEGAMAMUTE OFICIAL",
	"user_type": "brand", //ou "normal"
	"seller_reputation": {
		"level_id": "3_yellow",
		"power_seller_status": null,
		"transactions": {
		"canceled": 1825,
		"completed": 127496,
		"period": "historic",
		"ratings": {
			"negative": 0.06,
			"neutral": 0.08,
			"positive": 0.86
		},
		"total": 129321
		}
	},

	colocar depois da classe 'item__price '
*/

//api to get ship info 'https://api.mercadolibre.com/items/MLB1095827678/shipping_options?&zip_code=09530580';
//All product infos
var listaProdutos = {};
//To check return response from ajax
var i = 0;
//to pass item_ID to response from ajax
var current_itemID = '';
//meses abreviados
const monthNames = [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ];

restore_options();

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get(
		{
			CEP: '09530580',
			RUA: '...',
			BAIRRO: '...',
			CIDADE: '...',
			ESTADO: '...'
		},
		/* keep tracking element to know when to start main. (it waits for ads to exist)
		Note: 'load' method does not work with MercadoLivre.com.br, the page has scrips that change elements after loads */
		function(items) {
			let checkElementExist = setInterval( function()
			{
				if($('.ui-search-bottom-ads__container').children().length) {
					clearInterval(checkElementExist);
					main(items.CEP);
				}
			}, 100);
		}
	);
}

class Item {
	constructor(id, totalPaymentValue) {
		/* constructor*/
		this.id = id;
		// this.titulo = titulo;
		// this.valor = valor;
		this.totalPaymentValue = 0;

		// this.nome_do_vendedor = "";
		// this.reputacao_do_vendedor = 0;

	}
}

class Render {
	static totalPaymentValue(itemList) {
		// Para cada item
		$('.ui-search-layout > .ui-search-layout__item').each( () => {
			
			id = $(this).find('input[name=itemId]').val();

			let item = itemList.find(item => item.id === id);
			
			if (item && $(this).find('span.ui-search-item__group__element.ui-search-installments.ui-search-color--BLACK').length) {
				// renderiza o valor total da parcela na tela
				let totalPaymentValue = document.createElement('span');
				totalPaymentValue.className = "price-tag-symbol"
				totalPaymentValue.innerHTML = ' = ' + totalValue;
				$(this).find('.ui-search-item__group__element.ui-search-installments.ui-search-color--BLACK').find('.price-tag.ui-search-price__part').after(totalPaymentValue);
			}
		});
	}
}

class Pagina {
	static hasItems() {
		if ($('.ui-search-layout > .ui-search-layout__item').length) {
			return true;
		} else { return false; }
	}

	static get_informacao_dos_anuncios() {
		
		let itemList = [];

		// Para cada item
		$('.ui-search-layout > .ui-search-layout__item').each( () => {
			
			// let price__fraction = $(this).find('.ui-search-price.ui-search-price--size-medium.ui-search-item__group__element > span.price-tag-fraction').text();
			// let price__decimals = $(this).find('.ui-search-price.ui-search-price--size-medium.ui-search-item__group__element > span.price-tag-cents').text();
			
			// //construção do link da API
			// let urlShipInfo =
			// 	'https://api.mercadolibre.com/items/' + current_itemID + '/shipping_options?&zip_code=' + zip_code;
			
			// https://api.mercadolibre.com/items/MLB1305401062/shipping_options?&zip_code=09620030
	
			//var urlSellerInfo = 'https://api.mercadolibre.com/users/' + sellerID;

			//usado como chave da 'listaProdutos' quando houver resposta da API
			id = $(this).find('input[name=itemId]').val();
	
			if ($(this).find('span.ui-search-item__group__element.ui-search-installments.ui-search-color--BLACK').length) {
				//pega o valor da parcela mostrado na tela
				let installmentValue = (parseFloat(
					$(this).find('.ui-search-item__group__element.ui-search-installments.ui-search-color--BLACK').find('span.price-tag-fraction').text()
				) +
					parseFloat($(this).find('.ui-search-item__group__element.ui-search-installments.ui-search-color--BLACK').find('span.price-tag-cents').text()) / 100).toFixed(2);
				//pega a quantidade de parcelas mostrado na tela
				let numberOfInstallments = parseInt(
					$(this).find('.ui-search-item__group__element.ui-search-installments.ui-search-color--BLACK').text().replace('x', '')
				);
	
				let totalValue = (installmentValue * numberOfInstallments).toFixed(2);

				let item = new Item(id=id, totalPaymentValue=totalValue);

				itemList.push(item);
				
				// renderiza o valor total da parcela na tela
				let totalPaymentValue = document.createElement('span');
				totalPaymentValue.className = "price-tag-symbol"
				totalPaymentValue.innerHTML = ' = ' + totalValue;
				$(this).find('.ui-search-item__group__element.ui-search-installments.ui-search-color--BLACK').find('.price-tag.ui-search-price__part').after(totalPaymentValue);
			}	
			return itemList;
		});
	}
}

function main(zip_code) {
	
	//Verifica se o existe algum result, se não existir retorna
	if (!Pagina.hasItems()) {
		return false;
	}

	let itemList = [];
	
	//insere a referencia do arquivo CSS
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = 'Styles/Styles.css';
	link.type = 'text/css';
	//document.head.appendChild(link);

	itemList = Pagina.get_informacao_dos_anuncios();

	console.log(itemList);
	
		//faz o get na API do ML
		$.ajax({
			type: 'GET',
			url: urlShipInfo,
			dataType: 'json',
			beforeSend: function() {},
			//chamado quando a API responder
			error: function(xhr) {
				switch (xhr.status) {
					case 400:
						console.log('Erro: ' + xhr.status + ' - frete não encontrado.');
						break;
					case 404:
						console.log('Erro: ' + xhr.status + ' - página não encontrada');
						break;
				}
			},
			complete: function(current_itemID, data) {
				var urlItemInfo = 'https://api.mercadolibre.com/items/' + current_itemID + '/';
				switch (data.status) {
					//simulate a OR operator
					//400 or 200
					case 400:
					case 200:
						$.ajax({
							type: 'GET',
							url: urlItemInfo,
							dataType: 'json',
							success: function(current_itemID, data) {
								listaProdutos[current_itemID].vendedor.seller_id = data['seller_id'];
							}.bind(window, current_itemID),
							//quando completo pegará as infos do vendedor
							complete: function(current_itemID, data) {
								//monta a url pra pegar os dados do vendedor
								var urlSellerInfo =
									'https://api.mercadolibre.com/users/' +
									listaProdutos[current_itemID].vendedor.seller_id +
									'/';
								//verifica se o status do retorno é 200 (OK Succeed)
								switch (data.status) {
									case 200:
										//abre uma nova conexão
										$.ajax({
											type: 'GET',
											url: urlSellerInfo,
											dataType: 'json',
											//se bem sucedida atribui os valores encontrados do vendedor
											success: function(current_itemID, data) {
												listaProdutos[current_itemID].vendedor.reputacao =
													data['seller_reputation']['level_id'];
												listaProdutos[current_itemID].vendedor.nickname = data['nickname'];
												listaProdutos[current_itemID].vendedor.tipoDoUsuario =
													data['seller_user_type'];

												listaProdutos[current_itemID].vendas.completadas =
													data['seller_reputation']['transactions']['completed'];
												listaProdutos[current_itemID].vendas.canceladas =
													data['seller_reputation']['transactions']['canceled'];
												listaProdutos[current_itemID].vendas.pontos = data['points'];
												listaProdutos[current_itemID].vendas.negativas =
													data['seller_reputation']['transactions']['ratings'][
														'negative'
													];
												listaProdutos[current_itemID].vendas.neutras =
													data['seller_reputation']['transactions']['ratings']['neutral'];
												listaProdutos[current_itemID].vendas.positivas =
													data['seller_reputation']['transactions']['ratings'][
														'positive'
													];
											}.bind(window, current_itemID),
											//Depois de pegar os valores do vendedor
											complete: function(current_itemID, data) {
												switch (data.status) {
													//se retornou (OK Succeed)
													case 200:
														//coloca na tela os elementos
														pullReputation(current_itemID);
														break;
												}
											}.bind(window, current_itemID)
										});
										break;
								}
							}.bind(window, current_itemID)
						});
						break;
				}
			}.bind(window, current_itemID),
			success: function(current_itemID, data) {
				//Só edita os elementos da pagina se a API responder com sucesso
				//margem do nome do item
				$('.item__title.list-view-item-title').css('margin', '0px');
				//margem do rating
				$('.item__reviews').css('margin', '0px');
				//margem da quantidade vendidos
				$('.item__status').css('margin', '0px');

				//margem abaixo do 'Frete Gratis
				$('.item-installments.free-interest').css('marginBottom', '0px');
				$('.item-installments.showInterest').css('marginBottom', '0px');

				/*
				Só criar a tabela se o ID da tabela não existir,
				porque em alguns casos ele está duplicando a tabela, não sei porque
				*/
				if (!(current_itemID in listaProdutos)) {
					//cria um novo produto com a chave sendo o proprio id
					listaProdutos[current_itemID] = new Produto(
						current_itemID,
						price__fraction,
						price__decimals,
						data['options']
					);

					//cria a tabela só se houver resposta da api
					var table = document.createElement('TABLE');
					table.setAttribute('id', 'frete_table_' + current_itemID);
					table.style.fontSize = 'small';
					table.style.border = '0px';
					table.style.marginTop = '1px';
					table.style.display = 'block';
					table.style.fontStyle = 'Helvetica';
					table.style.color = 'blue';

					//Arrumar aqui porque as vezes o produto não tem frete calculado! 'CALCULAR FRETE'
					$.each(listaProdutos[current_itemID].opcoes_frete, function(key, value) {
						//variaveis que serao printadas
						var tipo_frete = key;
						var valor = 'R$ ' + (value['custo'] != 0 ? value['custo'].toFixed(2) : '-');
						var data_de =
							parseNN(value['data_de'].getDate()) + '/' + monthNames[value['data_de'].getMonth()];
						var data_ate = value.hasOwnProperty('data_ate')
							? ' - ' +
								parseNN(value['data_ate'].getDate()) +
								'/' +
								monthNames[value['data_ate'].getMonth()]
							: '';
						var const_data = data_de + data_ate;

						// Create an empty <tr> element and add it to the 1st position of the table:
						var row = table.insertRow(0);

						// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
						var cell_tipo = row.insertCell(0);
						var cell_custo = row.insertCell(1);
						var cell_data = row.insertCell(2);

						$(cell_tipo).css('width', '70px');
						$(cell_custo).css('width', '70px');

						// Add some text to the new cells:
						cell_tipo.innerHTML = tipo_frete;
						cell_custo.innerHTML = valor;
						cell_data.innerHTML = const_data;
					});

					//insere a tabela no html
					$('#' + current_itemID).find('h2.item__title.list-view-item-title').before(table);
					$('#PAD-' + current_itemID).find('h2.item__title.list-view-item-title').before(table);
				}
			}.bind(window, current_itemID)
		});
		i++;
}

function Produto(id, integerValue, valor_fracionado = 0, opcoes_frete) {
	var i = {};
	this.itemID = id;
	opcoes_frete.forEach(function(data) {
		i[data['name']] = {};
		var obj = i[data['name']];
		obj['custo'] = data['cost'];
		if (data['estimated_delivery_time']['date'] != null)
			obj['data_de'] = new Date(data['estimated_delivery_time']['date']);
		//obj['data_de'] = new Date(data['estimated_delivery_time']['date']);
		if (data['estimated_delivery_time']['offset']['date'] != null)
			obj['data_ate'] = new Date(data['estimated_delivery_time']['offset']['date']);

		//obj['data_ate'] = new Date(data['estimated_delivery_time']['offset']['date']);
		i[data['name']] = obj;
	});
	this.opcoes_frete = i;
	//console.log(this.opcoes_frete);
	if (isNaN(valor_fracionado)) {
		valor_fracionado = 0;
	}
	this.price = (parseInt(integerValue.toString().replace('.', '')) + parseFloat(valor_fracionado / 100)).toFixed(2);

	this.vendedor = { seller_id: '', nickname: '', reputacao: '', tipoDoUsuario: '' };
	this.vendas = { completadas: 0, canceladas: 0, pontos: 0, negativas: 0, neutras: 0, positivas: 0 };
}

//parse text with '1' to text with '01'
function parseNN(str_num) {
	if (str_num < 10) {
		str_num = '0' + str_num;
	}
	return str_num;
}

function pullReputation(item_ID) {
	//verifica se o vendedor tem reputação e também se o gráfico de reputação não existe
	if (listaProdutos[item_ID].vendedor.reputacao != null && $('.vip-reputation-info_' + item_ID).length == 0) {
		var reputacao = listaProdutos[item_ID].vendedor.reputacao.charAt(0);

		//console.log($('#' + item_ID).find('.item__price '));
		var elem_reputation_info = document.createElement('div');
		elem_reputation_info.setAttribute('class', 'vip-reputation-info_' + item_ID);
		elem_reputation_info.style.display = 'inline-block';

		var elem_reputation_thermometer = document.createElement('ol');
		elem_reputation_thermometer.setAttribute('class', 'reputation-thermometer');
		elem_reputation_thermometer.style.display = 'inline-block';

		var elem_vendedor_nickname = document.createElement('span');
		elem_vendedor_nickname.style.display = 'inline-block';

		elem_reputation_info.appendChild(elem_reputation_thermometer);

		var counter = 0;
		for (counter = 1; counter <= 5; counter++) {
			var elem_rect_reputation_thermometer = document.createElement('canvas');
			elem_rect_reputation_thermometer.setAttribute('class', 'reputation_' + current_itemID);
			elem_rect_reputation_thermometer.style.display = 'inline-block';
			if (counter != reputacao) {
				elem_rect_reputation_thermometer.style.opacity = '0.2';
			}
			elem_rect_reputation_thermometer.width = 15;
			elem_rect_reputation_thermometer.height = 6;
			if (counter == 1) {
				elem_rect_reputation_thermometer.style.marginLeft = '15px';
			}
			elem_rect_reputation_thermometer.style.marginRight = '4px';
			var context = elem_rect_reputation_thermometer.getContext('2d');
			switch (counter) {
				case 1:
					context.fillStyle = 'red';
					break;
				case 2:
					context.fillStyle = 'orange';
					break;
				case 3:
					context.fillStyle = 'yellow';
					break;
				case 4:
					context.fillStyle = 'greenyellow';
					break;
				case 5:
					context.fillStyle = 'limegreen';
					break;
			}
			context.fillRect(0, 0, 15, 6);
			//context.rect(0, 0, 20, 5);
			elem_reputation_thermometer.appendChild(elem_rect_reputation_thermometer);
		}

		//deixa o valor do produto com inline-block para podermos adicionarmos novos elementos ao lado
		$('#' + item_ID).find('.item__price ').css('display', 'inline-block');
		//adiciona o elemento ao lado do price
		$('#' + item_ID).find('.item__price ').after(elem_reputation_info);

		//deixa o valor do produto com inline-block para podermos adicionarmos novos elementos ao lado
		$('#PAD-' + item_ID).find('.item__price ').css('display', 'inline-block');
		//adiciona o elemento ao lado do price
		$('#PAD-' + item_ID).find('.item__price ').after(elem_reputation_info);

		//adiciona o valor do nickname no elemento SPAN de nickname
		elem_vendedor_nickname.textContent = listaProdutos[item_ID].vendedor.nickname;
		//adiciona o nickname do vendedor na página de busca
		$('.vip-reputation-info_' + item_ID).after(elem_vendedor_nickname);

		console.log(listaProdutos[item_ID].vendedor.nickname);

		// var elem = document.createElement('canvas');
		// elem.setAttribute('id', 'reputation_' + current_itemID);
		// elem.style.display = 'inline-block';
		// elem.width = 20;
		// elem.height = 5;
		// var context = elem.getContext('2d');
		// context.fillRect(0, 0, 20, 5);
	} else {
		//console.log(listaProdutos[item_ID]);
	}
}

/*
<div class="vip-reputation-info">
	<ol class="reputation-thermometer">
		<li class="reputation-thermometer-1">Vermelho</li>
		<li class="reputation-thermometer-2">Laranja</li>
		<li class="reputation-thermometer-3">Amarelo</li>
		<li class="reputation-thermometer-4">Verde claro</li>
		<li class="reputation-thermometer-5">Verde</li>
	</ol>
</div> 
*/
