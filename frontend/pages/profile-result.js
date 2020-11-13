import React from 'react'

const ProfileResult = ({ profileId }) => {
    return <div>{profileId}</div>
}

ProfileResult.getInitialProps = ({ query }) => {
    if (query)
        return {
            profileId: query.profileId,
        }
    else return { profileId: null }
}
export default ProfileResult
