function initialize() {
    $.ajax({
        url: `https://ptx.transportdata.tw/MOTC/v3/Rail/TRA/Station?$select=StationID%2CStationName%2CStationPosition%2CStationAddress%2CStationPhone%2CStationClass%2CStationURL&$orderby=StationID&$format=JSON`,
        method: 'GET',
        error: function (err) {
            console.log('Error:', err);
            if (err.status === 429) {
                alert('\u{1F342}很不幸地，短時間內免費呼叫 API 的次數已經用光......\u{1F61E}');
            } else {
                alert('\u{1F36E}這是尚未發現的錯誤，可以的話請協助回報\u{1F606}');
                alert(`錯誤訊息：${err.responseText}`);
            }
        },
        success: function (data) {
            $('body').append(
                `<div id="legend">
                    <button id="filter-" class="train filter" onclick="setButtonChar('');"></button>
                    <span class="font-M">全部 </span>
                    <button id="filter-0" class="train filter" onclick="setButtonChar('0');"></button>
                    <span class="font-M">特等 </span>
                    <button id="filter-1" class="train filter" onclick="setButtonChar('1');"></button>
                    <span class="font-M">一等 </span>
                    <button id="filter-2" class="train filter" onclick="setButtonChar('2');"></button>
                    <span class="font-M">二等 </span>
                    <button id="filter-3" class="train filter" onclick="setButtonChar('3');"></button>
                    <span class="font-M">三等 </span>
                    <button id="filter-4" class="train filter" onclick="setButtonChar('4');"></button>
                    <span class="font-M">簡易 </span>
                    <button id="filter-5" class="train filter" onclick="setButtonChar('5');"></button>
                    <span class="font-M">招呼 </span>
                    <label for="country" class="font-M">縣市篩選</label>
                    <select id="country" class="font-M" onchange="setButtonChar()">
                        <option value="" selected disabled>無篩選</option>
                        <optgroup label="北部" style="color: #BF0053;">
                            <option value="基隆市">基隆市</option>
                            <option value="新北市">新北市</option>
                            <option value="臺北市">臺北市</option>
                            <option value="桃園市">桃園市</option>
                            <option value="新竹縣">新竹縣</option>
                            <option value="新竹市">新竹市</option>
                            <option value="宜蘭縣">宜蘭縣</option>
                        </optgroup>
                        <optgroup label="中部" style="color: #BF5C00;">
                            <option value="苗栗縣">苗栗縣</option>
                            <option value="臺中市">臺中市</option>
                            <option value="彰化縣">彰化縣</option>
                            <option value="南投縣">南投縣</option>
                            <option value="雲林縣">雲林縣</option>
                        </optgroup>
                        <optgroup label="南部" style="color: #018FBE;">
                            <option value="嘉義縣">嘉義縣</option>
                            <option value="嘉義市">嘉義市</option>
                            <option value="臺南市">臺南市</option>
                            <option value="高雄市">高雄市</option>
                            <option value="屏東縣">屏東縣</option>
                        </optgroup>
                        <optgroup label="東部" style="color: #83BF00;">
                            <option value="臺東縣">臺東縣</option>
                            <option value="花蓮縣">花蓮縣</option>
                        </optgroup>
                    </select>
                </div>
                <div id="card-set"></div>`
            );
            $('#bodyJs').replaceWith(
              `<script>
                    let buttonChar = '';
                    setButtonChar('');
                    function setButtonChar(getChar = buttonChar) {
                        buttonChar = getChar;
                        showCards(buttonChar);
                    }
                </script>`
            );
        }
    });
}

function showCards(classChar = '') {
    const country = $('#country option:selected').val();
    $('.filter').css({
        'border-style': 'outset',
        'box-shadow': 'none',
    });
    $('.filter').prop('disabled', false);
    $('#country option:disabled').prop('disabled', false);
    $('#country option:selected').prop('disabled', true);
    $(`#filter-${buttonChar}`).css({
        'border-style': 'inset',
        'box-shadow': `0 0 10px 2px ${$(`#filter-${buttonChar}`).css('border-color')}`,
    });
    $(`#filter-${buttonChar}`).prop('disabled', true);
    $('.card').remove();
    
    let filter;
    if(classChar === '' && country === '') filter = '';
    else if(classChar === '') filter = `&$filter=contains(StationAddress%2C'${country}')`;
    else if(country === '') filter = `&$filter=StationClass%20eq%20'${classChar}'`;
    else filter = `&$filter=StationClass%20eq%20'${classChar}'%20and%20contains(StationAddress%2C'${country}')`;
    // console.log(filter);

    $.ajax({
        url: `https://ptx.transportdata.tw/MOTC/v3/Rail/TRA/Station?$select=StationID%2CStationName%2CStationPosition%2CStationAddress%2CStationPhone%2CStationClass%2CStationURL${filter}&$orderby=StationID&$format=JSON`,
        method: 'GET',
        error: function (err) {
            console.log('Error:', err);
            if (err.status === 429) {
                alert('\u{1F342}很不幸地，今日免費呼叫 API 的次數已經用光......\u{1F61E}');
            } else {
                alert('\u{1F36E}這是尚未發現的錯誤，可以的話請協助回報\u{1F606}');
                alert(`錯誤訊息：${err.responseText}`);
            }
        },
        success: function (data) {
            data.Stations.forEach(station => {
                const card =
                    `<div class="card level-${station.StationClass}">
                        <div>
                            <span class="font-L">${station.StationName.Zh_tw}</span>
                        </div>
                        <div>
                            <span class="font-M">${station.StationName.En}</span>
                        </div>
                        <div>
                            <span class="font-S">連絡電話：${station.StationPhone}</span>
                        </div>
                        <div>
                            <span class="font-S">${station.StationAddress}</span>
                        </div>
                        <div>
                            <span class="font-M"><a href="${station.StationURL}" target="_blank" class="train">官方網站</a></span>
                        </div>
                    </div>`
                $('#card-set').append(card);
                // console.log(station);
            });
        }
    });
}
