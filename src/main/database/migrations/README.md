# List of Migrations
## V1.0.0:
### Master data

| Sequence | File Name | Actions |
| :------: | --------- | ------- |
| 0001 | 0001.v1.0.0.catalog.migration.ts | Create table _catalog_item_|
| 0002 | 0002.v1.0.0.color.migration.ts| <ul><li>Create table _color_</li><li>Populate table _color_</li></ul>|
| 0003 | 0003.v1.0.0.language.migration.ts| <ul><li>Create table _language_</li><li>Populate table _language_</li></ul>|
| 0004 | 0004.v1.0.0.game-format.ts | |
| 0005 | 0005.v1.0.0.card-condition.ts | |

### Mtg

| Sequence | File Name | Actions |
| :------: | --------- | ------- |
| 0010 | 0010.v1.0.0.set.migration.ts| Create table _card_set_|
| 0011 | 0011.v1.0.0.card.symbol.migration.ts| <ul><li>Create table _card_symbol_</li><li>Create table _card_symbol_color_map_</li><li>Create table _card_symbol_alternative_</li></ul>|
| 0012 | 0012.v1.0.0.card.migration.ts | <ul><li>Create table _card_</li><li>Create table _card_multiverse_id_</li><li>Create table _card_game_</li><li>Create table _card_color_map_</li><li>Create table _card_face_</li><li>Create table _card_face_color_map_</li><li>Create table _card_card_map</li></ul>|
| 0013 | 0013.v1.0.0.oracle.migration.ts| <ul><li>Create table _oracle_ruling_</li><li>Create table _ruling_line_</li><li>Create table _oracle_</li><li>Create tabel _oracle_legality_</li><li>Create table _oracle_keyword_</li></ul>|

### Collection
| Sequence | File Name | Actions |
| :------: | --------- | ------- |
| 0020 | v1.0.0.collection.ts | <ul><li>Create table _collection_</li><li>Populate table _collection_</li></ul>|
| 0021 | v1.0.0.owned-card.migration.ts |Create table _owned_card_|


### Deck
| Sequence | File Name | Actions |
| :------: | --------- | ------- |
| 0030 | 0030.v1.0.0.deck.ts | <ul><li></li></ul>|
| 0031 | |<ul><li></li></ul>|
