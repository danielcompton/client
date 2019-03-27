// @flow
import * as React from 'react'
import Message from '../../messages'
import SpecialTopMessage from '../../messages/special-top-message'
import SpecialBottomMessage from '../../messages/special-bottom-message'
import {mobileTypingContainerHeight} from '../../input-area/normal/typing'
import {Box, Box2, NativeVirtualizedList, ErrorBoundary} from '../../../../common-adapters/mobile.native'
import * as Styles from '../../../../styles'
import type {Props} from './index.types'
import JumpToRecent from './jump-to-recent'
import ThreadSearch from '../../search/container'

class ConversationList extends React.PureComponent<Props> {
  _renderItem = ({index, item}) => {
    if (item === 'specialTop') {
      return <SpecialTopMessage conversationIDKey={this.props.conversationIDKey} measure={null} />
    } else if (item === 'specialBottom') {
      return <SpecialBottomMessage conversationIDKey={this.props.conversationIDKey} measure={null} />
    } else {
      const ordinalIndex = item
      const ordinal = this.props.messageOrdinals.get(ordinalIndex)
      const prevOrdinal = ordinalIndex > 0 ? this.props.messageOrdinals.get(ordinalIndex - 1) : null

      return (
        <Message
          key={ordinal}
          ordinal={ordinal}
          previous={prevOrdinal}
          measure={null}
          conversationIDKey={this.props.conversationIDKey}
        />
      )
    }
  }

  _getItem = (messageOrdinals, index) => {
    // Note we invert our list so we need to feed it things in the reverse order. We just invert the index
    // vs reversing the items to speed things up
    const itemCountIncludingSpecial = this._getItemCount(messageOrdinals)
    if (index === itemCountIncludingSpecial - 1) {
      return 'specialTop'
    } else if (index === 0) {
      return 'specialBottom'
    }

    // return ordinalIndex
    return itemCountIncludingSpecial - index - 2
  }

  _getItemCount = messageOrdinals => (messageOrdinals ? messageOrdinals.size + 2 : 2)

  _keyExtractor = item => {
    if (item === 'specialTop') {
      return 'specialTop'
    }
    if (item === 'specialBottom') {
      return 'specialBottom'
    }
    return String(this.props.messageOrdinals.get(item))
  }

  // Was using onEndReached but that was really flakey
  _onViewableItemsChanged = ({viewableItems}) => {
    const topRecord = viewableItems[viewableItems.length - 1]
    if (topRecord && topRecord.item === 'specialTop') {
      const ordinalRecord = viewableItems[viewableItems.length - 2]
      // ignore if we don't have real messages
      if (ordinalRecord && ordinalRecord.item !== 'specialBottom') {
        this.props.loadOlderMessages(this.props.messageOrdinals.get(ordinalRecord.item))
      }
    }
  }

  // not highly documented. keeps new content from shifting around the list if you're scrolled up
  _maintainVisibleContentPosition = {
    minIndexForVisible: 0,
  }

  _getOrdinalIndex = target => {
    for (let i = 0; i < this.props.messageOrdinals.size; i++) {
      const ordinal = this.props.messageOrdinals.get(i, 0)
      if (ordinal === target) {
        return i
      }
    }
    return -1
  }

  componentDidUpdate(prevProps: Props) {
    /*  const list = this._listRef.current
    if (!list) {
      return
    }

    if (
      !!this.props.centeredOrdinal &&
      (this.props.centeredOrdinal !== this._lastCenteredOrdinal ||
        this.props.messageOrdinals.first() !== prevProps.messageOrdinals.first() ||
        this.props.messageOrdinals.last() !== prevProps.messageOrdinals.last())
    ) {
      const index = this._getOrdinalIndex(this.props.centeredOrdinal)
      if (index >= 0) {
        this._lastCenteredOrdinal = this.props.centeredOrdinal
        list.scrollToIndex({index, viewPosition: 0.5})
      }
    } */
  }

  render() {
    return (
      <ErrorBoundary>
        <Box style={styles.container}>
          <NativeVirtualizedList
            contentContainerStyle={styles.contentContainer}
            data={this.props.messageOrdinals}
            inverted={true}
            getItem={this._getItem}
            getItemCount={this._getItemCount}
            renderItem={this._renderItem}
            maintainVisibleContentPosition={this._maintainVisibleContentPosition}
            onViewableItemsChanged={this._onViewableItemsChanged}
            keyboardShouldPersistTaps="handled"
            keyExtractor={this._keyExtractor}
            // Limit the number of pages rendered ahead of time (which also limits attachment previews loaded)
            windowSize={5}
            removeClippedSubviews={true}
          />
          <Box2 direction="vertical" gap="xtiny" style={styles.threadSearch}>
            {!this.props.containsLatestMessage && this.props.messageOrdinals.size > 0 && (
              <JumpToRecent onClick={this.props.onJumpToRecent} />
            )}
            {this.props.showThreadSearch && <ThreadSearch conversationIDKey={this.props.conversationIDKey} />}
          </Box2>
        </Box>
      </ErrorBoundary>
    )
  }
}

const styles = Styles.styleSheetCreate({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    bottom: -mobileTypingContainerHeight,
  },

  threadSearch: {
    bottom: 0,
    position: 'absolute',
  },
})

export default ConversationList
