// @flow
import * as React from 'react'
import * as Kb from '../../../common-adapters'
import * as Styles from '../../../styles'

type Props = {
  fullname: string,
  isAdmin: boolean,
  isOwner: boolean,
  username: string,
  onShowProfile: (username: string) => void,
}

const Participant = ({fullname, isAdmin, isOwner, username, onShowProfile}: Props) => (
  <Kb.Box2 direction="vertical" style={styles.container}>
    <Kb.ClickableBox key={username} onClick={() => onShowProfile(username)}>
      <Kb.Box2 direction="vertical" fullWidth={true} style={styles.rowContainer}>
        <Kb.Box2 direction="horizontal" fullWidth={true} style={styles.row}>
          <Kb.Avatar size={Styles.isMobile ? 48 : 32} username={username} />
          <Kb.Box2 direction="vertical" style={styles.wrapper}>
            <Kb.Box2 direction="horizontal" fullWidth={true} alignItems="center" gap="xtiny">
              <Kb.ConnectedUsernames colorFollowing={true} type="BodySemibold" usernames={[username]} />
              {(isAdmin || isOwner) && (
                <Kb.WithTooltip text={isOwner ? 'Owner' : 'Admin'}>
                  <Kb.Icon
                    color={isOwner ? Styles.globalColors.yellow2 : Styles.globalColors.black_50}
                    sizeType="Small"
                    type="iconfont-crown-owner"
                  />
                </Kb.WithTooltip>
              )}
            </Kb.Box2>
            {fullname !== '' && <Kb.Text type="BodySmall">{fullname}</Kb.Text>}
          </Kb.Box2>
        </Kb.Box2>
      </Kb.Box2>
    </Kb.ClickableBox>
  </Kb.Box2>
)

const styles = Styles.styleSheetCreate({
  container: {
    paddingTop: Styles.globalMargins.tiny,
  },
  row: {
    alignItems: 'center',
    flex: 1,
    marginRight: Styles.globalMargins.tiny,
  },
  rowContainer: Styles.platformStyles({
    common: {
      minHeight: 48,
      paddingLeft: Styles.globalMargins.small,
      paddingRight: Styles.globalMargins.small,
    },
    isElectron: {
      ...Styles.desktopStyles.clickable,
    },
    isMobile: {
      minHeight: 56,
    },
  }),
  wrapper: Styles.platformStyles({
    isElectron: {
      marginLeft: Styles.globalMargins.tiny,
    },
    isMobile: {
      marginLeft: Styles.globalMargins.small,
    },
  }),
})

export default Participant
