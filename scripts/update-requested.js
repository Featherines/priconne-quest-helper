let tips_are_enabled = true;

function update_requested(modified_item) {
    remove_item_from_disabled_items(modified_item.id.substring(0, modified_item.id.length - 4));
    build_data();
}

function remove_item_from_disabled_items(item_id) {
    let item_name = document.getElementById(item_id).title;
    let item_recipe = get_recipe(item_name, 1);

    for (let [item, value] of item_recipe) {
        if (disabled_items.includes(item)) {
            let index = disabled_items.indexOf(item);
            if (index > -1) {
                disabled_items.splice(index, 1);
                console.log(get_colored_message("Required Items", "Re-enabled " + highlight_code(item) + color_text(" due to an updated ", message_status.INFO) + highlight_code(item_name) + color_text(" amount.", message_status.INFO), message_status.INFO));
            }
        }
    }
}

function build_data() {
    // COLLECT ALL SELECTED ITEM DATA
    let mergedItemMap = new Map([...read_item("common"), ...read_item("copper"), ...read_item("silver"), ...read_item("gold"), ...read_item("purple"), ...read_item("misc")]);
    build_requested_item_table(mergedItemMap);

    // GET RECIPES
    let recipeArray = [];

    // GET ITEM RECIPES
    for (let [key, value] of mergedItemMap) {
        const recipe = get_recipe(key, value);
        if (recipe.size > 0) {
            recipeArray.push(recipe);
        }
    }

    if (recipeArray.length > 0 && tips_are_enabled) {
        tips_are_enabled = false;
    }

    if (!tips_are_enabled) {
        // FIGURE OUT TOTAL INGREDIENTS
        figure_out_total_ingredients(recipeArray);

        // FIGURE OUT RECOMMENDED QUEST
        build_recommended_quest_table(recipeArray);
    }
}

function build_requested_item_table(requested_items_map) {
    let html = "";
    if (requested_items_map.size > 0) {
        for (let [item, value] of requested_items_map) {
            html += "<div class=\"requested-item_div\">" +
                "<img class=\"item\" title=\"" + item + "\" src=\"" + get_item_image_path(item.split(' ').join('_')) + "\" alt=\"\">" +
                "<div class=\"item-amount requested-items_item-amount\">\u00D7" + value + "</div>" +
                "</div>";
        }
    }
    document.getElementById("requested-item-table").innerHTML = html;
}